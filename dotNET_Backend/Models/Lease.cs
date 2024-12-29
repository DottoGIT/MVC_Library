using MVC_Library.Data.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC_Library.Models
{
    public class Lease
    {
        [Key] public int Id { get; set; }
        [Required] public required DateTime LeaseDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        [Required] public required LeaseState State { get; set; }
        [Required, ForeignKey("User")] public required string UserId { get; set; }
        public User? User { get; set; }
        [Required, ForeignKey("Book")] public required int BookId {  get; set; }
        public Book? Book { get; set; }
        
        [ConcurrencyCheck]
        public Guid Version { get; set; }
    }
}
