using Microsoft.EntityFrameworkCore;
using MVC_Library.Data;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using static System.Reflection.Metadata.BlobBuilder;

namespace MVC_Library.Repository
{
    public class BookRepository : IBookRepository
    {
        private readonly AppDatabaseContext _context;

        public BookRepository(AppDatabaseContext context) 
        {
            _context = context;
        }

        public void Add(Book book)
        {
            _context.Books.Add(book);
            Save();
        }

        public IQueryable<Book> ApplySearchFilter(IQueryable<Book> books, string searchString)
        {
            if (searchString == null)
            {
                return books;
            }

            return books.Where(b => b.Title.Contains(searchString) || b.Author.Contains(searchString));
        }

        public void Delete(Book book)
        {
            _context.Books.Remove(book);
            Save();
        }

        public async Task<IEnumerable<Book>> GetAll()
        {
            return await _context.Books.ToListAsync();
        }

        public async Task<Book> GetByIdAsync(int id)
        {
            var book = await _context.Books.FirstOrDefaultAsync(i => i.Id == id);
            if (book == null)
            {
                throw new KeyNotFoundException($"No book found with ID {id}.");
            }
            return book;
        }

        public async Task<Book> GetByIdAsyncNoTracking(int id)
        {
            var book = await _context.Books.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
            if (book == null)
            {
                throw new KeyNotFoundException($"No book found with ID {id}.");
            }
            return book;
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Book book)
        {
            _context.Update(book);
            Save();
        }

        public async Task<IEnumerable<Book>> GetSearchedBooks(string searchString)
        {
            var books = _context.Books.AsQueryable();
            books = ApplySearchFilter(books, searchString);
            return await books.ToListAsync();
        }

        public async Task<IEnumerable<Book>> GetSearchedAvailableBooks(string searchString)
        {
            var books = _context.Books.AsQueryable();
            books = ApplySearchFilter(books, searchString);
            books = books.Where(b => !b.IsPernamentlyUnavailable);
            return await books.ToListAsync();
        }
    }
}
