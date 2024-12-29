using Microsoft.EntityFrameworkCore;
using MVC_Library.Data;
using MVC_Library.Data.Enums;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using System.Data;
using System.Linq;

namespace MVC_Library.Repository
{
    public class LeaseRepository : ILeaseRepository
    {
        private readonly AppDatabaseContext _context;

        public LeaseRepository(AppDatabaseContext context)
        {
            _context = context;
        }

        public void Add(Lease lease)
        {
            _context.Leases.Add(lease);
            Save();
        }

        public IQueryable<Lease> ApplyCheckboxFilter(IQueryable<Lease> leases, bool showAwaiting = false, bool showActive = false, bool showClosed = false, bool showDeclined = false)
        {
            var statesToShow = new List<LeaseState>();
            if (showAwaiting)
                statesToShow.Add(LeaseState.Reservation);
            if (showActive)
                statesToShow.Add(LeaseState.Active);
            if (showClosed)
                statesToShow.Add(LeaseState.Closed);
            if (showDeclined)
                statesToShow.Add(LeaseState.Declined);

            if (statesToShow.Any())
            {
                leases = leases.Where(l => statesToShow.Contains(l.State));
            }

            return leases;
        }

        public IQueryable<Lease>? ApplySeachFilter(IQueryable<Lease> leases, string searchString)
        {
            if (searchString == null)
            {
                return leases;
            }

            return leases.Where(b => (b.User.FirstName + " " + b.User.LastName).Contains(searchString) ||
                                            b.Book.Title.Contains(searchString));
        }

        public IQueryable<Lease> ApplySortingByLeaseState(IQueryable<Lease> leases)
        {
            return leases.OrderBy(l => l.State == LeaseState.Reservation ? 0 :
                                             l.State == LeaseState.Active ? 1 :
                                             l.State == LeaseState.Closed ? 2 : 3)
                               .ThenBy(l => l.State == LeaseState.Declined ? 0 : 1);

        }

        public void Delete(Lease lease)
        {
            _context.Leases.Remove(lease);
            Save();
        }

        public bool UserHasLeases(string userId)    
        {
            return _context.Leases.Any(l => l.UserId == userId);
        }

        public bool BookHasLeases(int bookId)
        {
            return _context.Leases.Any(l => l.BookId == bookId);
        }

        public async Task<IEnumerable<Lease>> GetAll()
        {
            return await _context.Leases
                .Include(l => l.User)
                .Include(l => l.Book)
                .ToListAsync();
        }

        public async Task<Lease> GetByIdAsync(int id)
        {
            var lease = await _context.Leases.FirstOrDefaultAsync(i => i.Id == id);
            if (lease == null)
            {
                throw new KeyNotFoundException($"No lease found with ID {id}.");
            }
            return lease;
        }

        public async Task<IEnumerable<Lease>> GetSortedLeasesBySearchAndCheckboxes(string searchString, 
                                                                                      bool showAwaiting, 
                                                                                      bool showActive, 
                                                                                      bool showClosed, 
                                                                                      bool showDeclined)
        {
            var leases = _context.Leases
                .Include(l => l.User)
                .Include(l => l.Book)
                .AsQueryable();

            leases = ApplySeachFilter(leases, searchString);
            leases = ApplyCheckboxFilter(leases, showAwaiting, showActive, showClosed, showDeclined);
            leases = ApplySortingByLeaseState(leases);

            return await leases.ToListAsync();
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Lease book)
        {
            throw new NotImplementedException();
        }
    }
}
