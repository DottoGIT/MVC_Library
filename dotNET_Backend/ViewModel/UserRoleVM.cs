using MVC_Library.Models;

namespace MVC_Library.ViewModel
{
    public class UserRoleVM
    {
        public required User User { get; set; }
        public required bool IsLibrarian { get; set; }
    }
}
