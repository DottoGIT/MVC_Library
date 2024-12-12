using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using MVC_Library.Repository;
using MVC_Library.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using MVC_Library.Data;

namespace MVC_Library.Controllers
{
    [Authorize(Roles = UserRoles.Librarian)]
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

        public async Task<IActionResult> Index(string searchString, int page = 1)
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
                IsReserved = _leaseRepository.BookHasLeases(b.Id), // Check if the book is leased
                Price = b.Price
            }).ToList();

            ViewBag.TotalPages = (int)(Math.Ceiling(bookVMs.Count() / (double)_pageSize));
            bookVMs = bookVMs.Skip((page - 1) * _pageSize).Take(_pageSize).ToList();
            return View(bookVMs);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Book book)
        {
            if (!ModelState.IsValid)
            {
                return View(book);
            }

            _bookRepository.Add(book);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Edit(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
            {
                TempData["ResultMessage"] = "Book was not found, try again later";
                return RedirectToAction("Index");
            }

            var bookVM = new BookVM
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Publisher = book.Publisher,
                YearOfPublication = book.YearOfPublication,
                Price = book.Price
            };

            return View(bookVM);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, BookVM bookVM)
        {
            if (!ModelState.IsValid)
            {
                TempData["ResultMessage"] = "Invalid book data";
                return View("Edit", bookVM);
            }

            var book = await _bookRepository.GetByIdAsyncNoTracking(id);
            
            if(book == null)
            {
                TempData["ResultMessage"] = "Book was not found in database";
                return RedirectToAction("Index");
            }

            var bookChanged = new Book
            {
                Id=book.Id,
                Title = bookVM.Title,
                Author = bookVM.Author,
                Publisher = bookVM.Publisher,
                YearOfPublication= bookVM.YearOfPublication,
                Price = bookVM.Price,
                IsPernamentlyUnavailable = book.IsPernamentlyUnavailable
            };

            _bookRepository.Update(bookChanged);
            TempData["ResultMessage"] = "Book was edited";

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
            {
                return RedirectToAction("Index");
            }

            bool isBookInUse = _leaseRepository.BookHasLeases(id);
            if (isBookInUse)
            {
                TempData["ResultMessage"] = "Somebody reserved book while performing an action";
                return RedirectToAction("Index");
            }

            _bookRepository.Delete(book);
            TempData["ResultMessage"] = "Book deleted";
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> MarkAsPermanentlyUnavailable(int bookId)
        {
            var book = await _bookRepository.GetByIdAsync(bookId);
            if (book == null)
            {
                return RedirectToAction("Index");
            }

            book.IsPernamentlyUnavailable = true;
            _bookRepository.Save();

            TempData["ResultMessage"] = "Book marked as Pernamently Unavailable";
            return RedirectToAction("Index");
        }
    }
}
