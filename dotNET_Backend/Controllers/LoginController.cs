using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MVC_Library.Data;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using MVC_Library.ViewModel;

namespace MVC_Library.Controllers
{
    public class LoginController : Controller
    {

        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly ILeaseRepository _leaseRepository;

        public LoginController(UserManager<User> userManager, SignInManager<User> signInManager, ILeaseRepository leaseRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _leaseRepository = leaseRepository;
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(UserRegisterVM registerVM)
        {
            if (!ModelState.IsValid)
            {
                return View(registerVM);
            }

            var user = await _userManager.FindByEmailAsync(registerVM.Email);
            var nick = await _userManager.FindByNameAsync(registerVM.UserName);

            if (user != null)
            {
                TempData["ResultMessage"] = "This email address is already is use";
                return View(registerVM);
            }
            if (nick != null)
            {
                TempData["ResultMessage"] = "This username is already is use";
                return View(registerVM);
            }
            if (registerVM.Password != registerVM.ConfirmPassword)
            {
                TempData["ResultMessage"] = "Passwords dont match";
                return View(registerVM);
            }

            var newUser = new User()
            {
                UserName = registerVM.UserName,
                Email = registerVM.Email,
                FirstName = registerVM.FirstName,
                LastName = registerVM.LastName
            };
            var newUserResponse = await _userManager.CreateAsync(newUser, registerVM.Password);
            if (newUserResponse.Succeeded)
            {
                var setRole = await _userManager.AddToRoleAsync(newUser, UserRoles.User);
                if (setRole.Succeeded)
                {
                    var result = await _signInManager.PasswordSignInAsync(newUser, registerVM.Password, false, false);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        TempData["ResultMessage"] = "User sign in assignment failed.";
                        return View(registerVM);
                    }
                }
                else
                {
                    TempData["ResultMessage"] = "User role assignment failed.";
                    return View(registerVM);
                }
            }
            else
            {
                TempData["ResultMessage"] = "User creation failed: " + string.Join(", ", newUserResponse.Errors.Select(e => e.Description));
                return View(registerVM);
            }
        }


        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(UserLoginVM loginVM)
        {
            if (!ModelState.IsValid)
            {
                TempData["ResultMessage"] = "Wrong credentials please try again";
                return View(loginVM);
            }

            var user = await _userManager.FindByNameAsync(loginVM.UserName);
            if (user != null)
            {
                var passowrdCheck = await _userManager.CheckPasswordAsync(user, loginVM.Password);
                if (passowrdCheck)
                {
                    var result = await _signInManager.PasswordSignInAsync(user, loginVM.Password, false, false);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
            }
            TempData["ResultMessage"] = "Wrong credentials please try again";
            return View(loginVM);
        }

        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> Delete()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                TempData["ResultMessage"] = "Account deletion was unsuccessful. Please try again later.";
                return RedirectToAction("Index", "Home");
            }

            bool hasLeases = _leaseRepository.UserHasLeases(user.Id);
            if (hasLeases)
            {
                TempData["ResultMessage"] = "You cannot delete your account because you have registered reservations";
                return RedirectToAction("Index", "UserAccount");
            }

            await _signInManager.SignOutAsync();

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                TempData["ResultMessage"] = "Account deletion was successful.";
                return RedirectToAction("Index", "Home");
            }

            TempData["ResultMessage"] = "Account deletion was unsuccessful. Please try again later.";
            return RedirectToAction("Index", "Home");
        }
    }
}
