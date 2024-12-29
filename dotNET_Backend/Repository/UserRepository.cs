using Microsoft.EntityFrameworkCore;
using MVC_Library.Data;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using static System.Reflection.Metadata.BlobBuilder;

namespace MVC_Library.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDatabaseContext _context;

        public UserRepository(AppDatabaseContext context)
        {
            _context = context;
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
            Save();
        }

        public void Delete(User user)
        {
            _context.Users.Remove(user);
            Save();
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }


        public IQueryable<User> ApplySearchFilter(IQueryable<User> users, string searchString)
        {
            if (searchString == null)
            {
                return users;
            }

            return users.Where(b => (b.FirstName + " " + b.LastName).Contains(searchString));
        }

        public async Task<User> GetByIdAsync(string id)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(i => i.Id == id);
            if (user == null)
            {
                throw new KeyNotFoundException($"No user found with ID {id}.");
            }
            return user;
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(User user)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<User>> GetSearchedUsers(string searchString)
        {
            var users = _context.Users.AsQueryable();
            users = ApplySearchFilter(users, searchString);
            return await users.ToListAsync();
        }
    }
}
