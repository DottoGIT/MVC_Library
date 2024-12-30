using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using MVC_Library.Repository;
using MVC_Library.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using MVC_Library.Data;
using System.Collections;

namespace MVC_Library.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManageBooksController : Controller
    {
        private readonly IBookRepository _bookRepository;
        private readonly ILeaseRepository _leaseRepository;

        private readonly int _pageSize = 9;

        public ManageBooksController(IBookRepository bookRepository, ILeaseRepository leaseRepository)
        {
            _bookRepository = bookRepository;
            _leaseRepository = leaseRepository;
        }

        [HttpGet("{searchString?}")]
        public async Task<IActionResult> GetBooks(string searchString = null, int page = 1)
        {
            var books = await _bookRepository.GetSearchedBooks(searchString);

            var bookVMs = books.Select(b => new BookVM
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                Publisher = b.Publisher,
                YearOfPublication = b.YearOfPublication,
                IsPernamentlyUnavailable = b.IsPernamentlyUnavailable,
                IsReserved = _leaseRepository.BookHasLeases(b.Id),
                Price = b.Price
            }).ToList();

            int totalPages = (int)(Math.Ceiling(bookVMs.Count() / (double)_pageSize));
            bookVMs = bookVMs.Skip((page - 1) * _pageSize).Take(_pageSize).ToList();

            return Ok(new
            {
                Data = bookVMs,
                Pagination = new
                {
                    CurrentPage = page,
                    TotalPages = totalPages
                }
            });
        }

        [HttpPost]
        public IActionResult Create([FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _bookRepository.Add(book);
            return CreatedAtAction(nameof(Create), new { id = book.Id }, book);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, BookVM bookVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
            {
                return NotFound($"Book with ID {id} was not found.");
            }

            book.Title = bookVM.Title;
            book.Author = bookVM.Author;
            book.Publisher = bookVM.Publisher;
            book.YearOfPublication = bookVM.YearOfPublication;
            book.Price = bookVM.Price;

            _bookRepository.Update(book);

            return Ok(book);
        }


        [HttpDelete("{id}")]
        [Authorize(Policy = JWT_Identity.LibrarianPolicyName)]
        public async Task<IActionResult> Delete(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
            {
                return NotFound($"Book with ID {id} was not found.");
            }

            bool isBookInUse = _leaseRepository.BookHasLeases(id);
            if (isBookInUse)
            {
                return Conflict("The book is currently reserved or leased and cannot be deleted.");
            }

            _bookRepository.Delete(book);
            return Ok($"Book with ID {id} was successfully deleted.");
        }


        [HttpPut("{id}/mark-unavailable")]
        public async Task<IActionResult> MarkAsPermanentlyUnavailable(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
            {
                return NotFound($"Book with ID {id} was not found."); // Return 404 Not Found
            }

            book.IsPernamentlyUnavailable = true;
            _bookRepository.Save();

            return Ok(new { message = $"Book with ID {id} has been marked as permanently unavailable." });
        }

    }
}
