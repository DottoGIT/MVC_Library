using System.ComponentModel.DataAnnotations;

namespace MVC_Library.ViewModel
{
    public class UserRegisterVM
    {
        [Display(Name = "UserName")]
        [Required(ErrorMessage = "Username is required")]
        public required string UserName { get; set; }

        [Display(Name = "Email")]
        [Required(ErrorMessage = "Email is required")]
        public required string Email { get; set; }

        [Display(Name = "FirstName")]
        [Required(ErrorMessage = "First name is required")]
        public required string FirstName { get; set; }
        [Display(Name = "LastName")]
        [Required(ErrorMessage = "Last name is required")]
        public required string LastName { get; set; }

        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required")]
        public required string Password { get; set; }

        [Display(Name = "ConfirmPassword")]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Confirm Password")]
        public required string ConfirmPassword { get; set; }
    }
}

