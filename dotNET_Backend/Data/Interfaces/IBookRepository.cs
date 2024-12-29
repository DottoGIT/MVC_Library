using MVC_Library.Models;

namespace MVC_Library.Data.Interfaces
{
    public interface IBookRepository
    {
        Task<IEnumerable<Book>> GetAll();
        Task<Book> GetByIdAsync(int id);
        Task<Book> GetByIdAsyncNoTracking(int id);
        IQueryable<Book> ApplySearchFilter(IQueryable<Book> books, string searchString);

        Task<IEnumerable<Book>> GetSearchedBooks(string searchString);
        Task<IEnumerable<Book>> GetSearchedAvailableBooks(string searchString);

        void Add(Book book);
        void Update(Book book);
        void Delete(Book book);
        void Save();
    }
}
