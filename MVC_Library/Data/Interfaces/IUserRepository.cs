using MVC_Library.Models;

namespace MVC_Library.Data.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAll();
        Task<User> GetByIdAsync(string id);
        IQueryable<User> ApplySearchFilter(IQueryable<User> users, string searchString);

        Task<IEnumerable<User>> GetSearchedUsers(string searchString);

        void Add(User User);
        void Update(User User);
        void Delete(User User);
        void Save();
    }
}
