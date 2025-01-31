﻿using System.ComponentModel.DataAnnotations;

namespace MVC_Library.ViewModel
{
    public class UserLoginVM
    {
        [Display(Name = "serName")]
        [Required(ErrorMessage = "Username is required")]
        public required string userName { get; set; }
        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required")]
        public required string Password { get; set; }
    }
}
