using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MVC_Library.Data.Enums;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using MVC_Library.ViewModel;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;


namespace MVC_Library.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class LoginController : Controller
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly ILeaseRepository _leaseRepository;
        private readonly IConfiguration _configuration;

        public LoginController(UserManager<User> userManager, SignInManager<User> signInManager, ILeaseRepository leaseRepository, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _leaseRepository = leaseRepository;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Create(UserRegisterVM registerVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(registerVM.Email);
            var nick = await _userManager.FindByNameAsync(registerVM.UserName);

            if (user != null)
            {
                return Conflict("This email address is already in use");
            }
            if (nick != null)
            {
                return Conflict("This username is already in use");
            }
            if (registerVM.Password != registerVM.ConfirmPassword)
            {
                return BadRequest("Passwords don't match");
            }

            var newUser = new User()
            {
                UserName = registerVM.UserName,
                Email = registerVM.Email,
                FirstName = registerVM.FirstName,
                LastName = registerVM.LastName,
                Role = UserRole.User
            };

            var newUserResponse = await _userManager.CreateAsync(newUser, registerVM.Password);
            if (!newUserResponse.Succeeded)
            {
                return BadRequest($"User creation failed: {string.Join(", ", newUserResponse.Errors.Select(e => e.Description))}");
            }

            var token = GenerateJwtToken(newUser);
            return Ok(new { token, user = new { newUser.UserName, newUser.Email, newUser.FirstName, newUser.LastName } });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginVM loginVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid data, please check your input." });
            }

            var user = await _userManager.FindByNameAsync(loginVM.UserName);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(user, loginVM.Password);
            if (!passwordCheck)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new { user.UserName, user.Email, user.FirstName, user.LastName } });
        }


        [HttpPost("delete")]
        public async Task<IActionResult> Delete()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest(new { message = "Account deletion was unsuccessful. Please try again later." });
            }

            bool hasLeases = _leaseRepository.UserHasLeases(user.Id);
            if (hasLeases)
            {
                return BadRequest(new { message = "You cannot delete your account because you have registered reservations." });
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { message = "Account deletion was successful." });
            }

            return BadRequest(new { message = "Account deletion was unsuccessful. Please try again later." });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>();
            if (user.Role == UserRole.Librarian)
            {
                claims.Add(new Claim("Role", "Librarian"));
            }
            else
            {
                claims.Add(new Claim("Role", "User"));
            }
            var x = _configuration["JwtSettings:Key"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
