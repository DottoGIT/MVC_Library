using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MVC_Library.Models;

namespace MVC_Library.Data
{
    public class AppDatabaseContext : IdentityDbContext<User>
    {
        public AppDatabaseContext(DbContextOptions<AppDatabaseContext> options)
            : base(options) { }

        public DbSet<Book> Books { get; set; }
        public DbSet<Lease> Leases { get; set; }
    }
}
