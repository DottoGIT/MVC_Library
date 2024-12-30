using Microsoft.AspNetCore.Identity;
using MVC_Library.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace MVC_Library.Models
{
    public class User : IdentityUser
    {
        [Required] 
        public required string FirstName { get; set; }
        [Required]
        public required string LastName { get; set; }

        public UserRole Role { get; set; }
    }
}
