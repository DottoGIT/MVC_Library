using MVC_Library.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace MVC_Library.ViewModel
{
    public class BookVM
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Author { get; set; }
        public required string Publisher { get; set; }
        public required int YearOfPublication { get; set; }
        public required decimal Price {  get; set; }
        public bool IsPernamentlyUnavailable { get; set; }
        public bool IsReserved { get; set; }
    }
}