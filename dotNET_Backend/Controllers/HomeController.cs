using Microsoft.AspNetCore.Mvc;
using MVC_Library.Data.Enums;
using MVC_Library.Data.Interfaces;
using MVC_Library.ViewModel;

namespace MVC_Library.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IBookRepository _bookRepository;
        private readonly ILeaseRepository _leaseRepository;
        private readonly int _pageSize = 9;

        public HomeController(ILogger<HomeController> logger, ILeaseRepository leaseRepository, IBookRepository bookRepository)
        {
            _logger = logger;
            _leaseRepository = leaseRepository;
            _bookRepository = bookRepository;
        }

        public async Task<IActionResult> Index(string searchString, int page = 1)
        {
            var books = await _bookRepository.GetSearchedAvailableBooks(searchString);
            ViewBag.TotalPages = Math.Ceiling(books.Count() / (double)_pageSize);
            ViewBag.CurrentPage = page;

            var pagedBooks = books
                .Skip((page - 1) * _pageSize)
                .Take(_pageSize)
                .ToList();

            var leases = await _leaseRepository.GetAll();
            var bookVMs = pagedBooks.Select(book => new BookVM
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Publisher = book.Publisher,
                YearOfPublication = book.YearOfPublication,
                IsPernamentlyUnavailable = book.IsPernamentlyUnavailable,
                Price = book.Price,
                IsReserved = leases.Any(lease => lease.Book.Id == book.Id &&
                                                 (lease.State == LeaseState.Reservation || lease.State == LeaseState.Active))
            }).ToList();

            return View(bookVMs);
        }

    }
}