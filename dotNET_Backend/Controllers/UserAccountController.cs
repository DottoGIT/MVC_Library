using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MVC_Library.Data.Enums;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using MVC_Library.ViewModel;

namespace MVC_Library.Controllers
{
    public class UserAccountController : Controller
    {
        private readonly ILeaseRepository _leaseRepository;
        private readonly UserManager<User> _userManager;
        private readonly int _pageSize = 9;

        public UserAccountController(ILeaseRepository leaseRepository, UserManager<User> userManager)
        {
            _leaseRepository = leaseRepository;
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Reservations(string searchString, bool showAwaiting = false, bool showActive = false, bool showClosed = false, bool showDeclined = false, int page = 1)
        {
            IEnumerable<Lease> leases = await _leaseRepository.GetSortedLeasesBySearchAndCheckboxes(
                searchString,
                showAwaiting,
                showActive,
                showClosed,
                showDeclined
            );

            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                TempData["ResultMessage"] = "Error occured while getting current user";
                return View();
            }
            leases = leases.Where(l => l.UserId == currentUser.Id);

            ViewBag.TotalPages = (int)(Math.Ceiling(leases.Count() / (double)_pageSize));
            leases = leases.Skip((page - 1) * _pageSize).Take(_pageSize);

            return View(leases);
        }

        [HttpPost]
        public IActionResult CreateReservation(LeaseVM leaseVM)
        {
            if(!ModelState.IsValid)
            {
                TempData["ResultMessage"] = "Error occured while creating a reservation. Try again later.";
                return RedirectToAction("Index", "Home");
            }

            Lease lease = new Lease()
            {
                LeaseDate = DateTime.Now,
                State = LeaseState.Reservation,
                UserId = leaseVM.UserId,
                BookId = leaseVM.BookId
            };

            _leaseRepository.Add(lease);
            TempData["ResultMessage"] = "Reservation created.";
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var lease = await _leaseRepository.GetByIdAsync(id);
            if (lease == null)
            {
                TempData["ResultMessage"] = "Lease not found.";
                return RedirectToAction("Reservations");
            }
            if (lease.State != LeaseState.Reservation)
            {
                TempData["ResultMessage"] = "Lase status was changed while performing an action.";
                return RedirectToAction("Reservations");
            }

            _leaseRepository.Delete(lease);
            TempData["ResultMessage"] = "Reservation deleted successfully.";

            return RedirectToAction("Reservations");
        }
    }

}
