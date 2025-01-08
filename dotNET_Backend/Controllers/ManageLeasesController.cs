using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVC_Library.Data.Enums;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using MVC_Library.ViewModel;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_Library.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManageLeasesController : ControllerBase
    {
        private readonly ILeaseRepository _leaseRepository;
        private readonly UserManager<User> _userManager;
        private readonly int _pageSize = 9;

        public ManageLeasesController(ILeaseRepository leaseRepository, UserManager<User> userManager)
        {
            _leaseRepository = leaseRepository;
            _userManager = userManager;
        }

        [HttpGet("{searchString?}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLeases(
            string searchString = null,
            [FromQuery] bool showAwaiting = false,
            [FromQuery] bool showActive = false,
            [FromQuery] bool showClosed = false,
            [FromQuery] bool showDeclined = false,
            [FromQuery] int page = 1)
        {
            var leases = await _leaseRepository.GetSortedLeasesBySearchAndCheckboxes(
                searchString,
                showAwaiting,
                showActive,
                showClosed,
                showDeclined
            );

            var totalItems = leases.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)_pageSize);

            leases = leases.Skip((page - 1) * _pageSize).Take(_pageSize);

            return Ok(new
            {
                Data = leases,
                Pagination = new
                {
                    CurrentPage = page,
                    TotalPages = totalPages
                }
            });
        }

        [HttpPost()]
        [Authorize(Policy = "user")]
        public IActionResult CreateReservation([FromBody] LeaseVM leaseVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid reservation data." });
            }

            var lease = new Lease
            {
                LeaseDate = DateTime.Now,
                State = LeaseState.Reservation,
                UserId = leaseVM.UserId,
                BookId = leaseVM.BookId
            };

            _leaseRepository.Add(lease);

            return Ok();
        }

        [HttpPut("{id}/accept")]
        [Authorize(Policy = "admin")]
        public async Task<IActionResult> AcceptLease(int id)
        {
            var lease = await _leaseRepository.GetByIdAsync(id);
            if (lease == null || lease.State != LeaseState.Reservation)
            {
                return NotFound(new { Message = "Lease not found or cannot be accepted." });
            }

            try
            {
                lease.State = LeaseState.Active;
                lease.Version = Guid.NewGuid();
                _leaseRepository.Save();

                return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { Message = "The lease record was updated by another librarian. Changes are not saved." });
            }
        }

        [HttpPut("{id}/decline")]
        [AllowAnonymous]
        public async Task<IActionResult> DeclineLease(int id)
        {
            var lease = await _leaseRepository.GetByIdAsync(id);
            if (lease == null || lease.State != LeaseState.Reservation)
            {
                return NotFound(new { Message = "Lease not found or cannot be declined." });
            }

            lease.State = LeaseState.Declined;
            lease.Version = Guid.NewGuid();
            _leaseRepository.Save();


            return Ok();
        }

        [HttpPut("{id}/close")]
        [Authorize(Policy = "admin")]
        public async Task<IActionResult> CloseLease(int id)
        {
            var lease = await _leaseRepository.GetByIdAsync(id);
            if (lease == null || lease.State != LeaseState.Active)
            {
                return NotFound(new { Message = "Lease not found or cannot be closed." });
            }

            lease.State = LeaseState.Closed;
            lease.ReturnDate = DateTime.UtcNow;
            lease.Version = Guid.NewGuid();
            _leaseRepository.Save();

            return Ok();
        }
    }
}
