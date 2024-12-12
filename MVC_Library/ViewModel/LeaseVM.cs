using System.ComponentModel.DataAnnotations;

namespace MVC_Library.ViewModel
{
    public class LeaseVM
    {
        [Required] public required string UserId { get; set; }
        [Required] public required int BookId { get; set; }
    }
}
