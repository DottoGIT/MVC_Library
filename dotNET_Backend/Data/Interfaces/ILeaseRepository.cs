using Microsoft.EntityFrameworkCore;
using MVC_Library.Models;

namespace MVC_Library.Data.Interfaces
{
    public interface ILeaseRepository
    {
        Task<IEnumerable<Lease>> GetAll();
        Task<Lease> GetByIdAsync(int id);
        IQueryable<Lease> ApplySeachFilter(IQueryable<Lease> leases, string searchString);
        IQueryable<Lease> ApplyCheckboxFilter(IQueryable<Lease> leases, bool showAwaiting = false, bool showActive = false, bool showClosed = false, bool showDeclined = false);
        IQueryable<Lease> ApplySortingByLeaseState(IQueryable<Lease> leases);

        Task<IEnumerable<Lease>> GetSortedLeasesBySearchAndCheckboxes(string searchString,
                                                                      bool showAwaiting,
                                                                      bool showActive,
                                                                      bool showClosed,
                                                                      bool showDeclined);


        bool UserHasLeases(string userId);
        bool BookHasLeases(int bookId);
        void Add(Lease lease);
        void Update(Lease lease);
        void Delete(Lease lease);
        void Save();
    }
}
