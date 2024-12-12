using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC_Library.Models
{
    public class Book
    {
        [Key] public int Id { get; set; }
        [Required] public required string Title { get; set; }
        [Required] public required string Author { get; set; }
        [Required] public required string Publisher { get; set; }
        [Required] public required int YearOfPublication{ get; set; }
        [Required, Column(TypeName = "decimal(6,2)")] public required decimal Price { get; set; }
        public bool IsPernamentlyUnavailable { get; set; } = false;
        public List<Lease> HistoryOfLeases { get; set; } = new List<Lease>();
    }
}
