using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVC_Library.Data;
using MVC_Library.Data.Enums;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using static System.Reflection.Metadata.BlobBuilder;

namespace MVC_Library.Controllers
{
    [Authorize(Roles = UserRoles.Librarian)]
    public class ManageLeasesController : Controller
    {
        private readonly ILeaseRepository _leaseRepository;
        private readonly int _pageSize = 9;

        public ManageLeasesController(ILeaseRepository leaseRepository)
        {
            _leaseRepository = leaseRepository;
        }

        public async Task<IActionResult> Index(string searchString, bool showAwaiting = false, bool showActive = false, bool showClosed = false, bool showDeclined = false, int page = 1)
        {
            IEnumerable<Lease> leases = await _leaseRepository.GetSortedLeasesBySearchAndCheckboxes(
                searchString,
                showAwaiting,
                showActive,
                showClosed,
            showDeclined
            );

            ViewBag.TotalPages = (int)(Math.Ceiling(leases.Count() / (double)_pageSize));
            leases = leases.Skip((page - 1) * _pageSize).Take(_pageSize);

            return View(leases);
        }

        [HttpPost]
        public async Task<IActionResult> Accept(int id)
        {
            var lease = await _leaseRepository.GetByIdAsync(id);
            if (lease == null || lease.State != LeaseState.Reservation)
            {
                TempData["ResultMessage"] = "Lease not found or cannot be accepted.";
                return RedirectToAction("Index");
            }

            try
            {
                lease.State = LeaseState.Active;
                lease.Version = Guid.NewGuid();
                Thread.Sleep(5000);
                _leaseRepository.Save();

                TempData["ResultMessage"] = "Lease has been accepted and is now active.";
            }
            catch (DbUpdateConcurrencyException)
            {
                TempData["ResultMessage"] = "The lease record was updated by another librarian. Changes are not saved.";
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Decline(int id)
        {
            var lease = await _leaseRepository.GetByIdAsync(id);
            if (lease == null || lease.State != LeaseState.Reservation)
            {
                TempData["ResultMessage"] = "Lease not found or cannot be declined.";
                return RedirectToAction("Index");
            }

            lease.State = LeaseState.Declined;
            lease.Version = Guid.NewGuid();
            _leaseRepository.Save();

            TempData["ResultMessage"] = "Lease has been declined.";
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Close(int id)
        {
            var lease = await _leaseRepository.GetByIdAsync(id);
            if (lease == null || lease.State != LeaseState.Active)
            {
                TempData["ResultMessage"] = "Lease not found or cannot be closed.";
                return RedirectToAction("Index");
            }

            lease.State = LeaseState.Closed;
            lease.ReturnDate = DateTime.UtcNow;
            lease.Version = Guid.NewGuid();
            _leaseRepository.Save();

            TempData["ResultMessage"] = "Lease has been closed.";
            return RedirectToAction("Index");
        }

    }
}
