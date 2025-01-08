using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MVC_Library.Data;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using MVC_Library.ViewModel;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using static System.Reflection.Metadata.BlobBuilder;

namespace MVC_Library.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManageUsersController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<User> _userManager;
        private readonly int _pageSize = 9;

        public ManageUsersController(IUserRepository userRepository, UserManager<User> userManager)
        {
            _userRepository = userRepository;
            _userManager = userManager;
        }

        [HttpGet("{searchString?}")]
        [Authorize(Policy = "admin")]
        public async Task<IActionResult> Index(string searchString = null, int page = 1)
        {
            IEnumerable<User> users = await _userRepository.GetSearchedUsers(searchString);
            int totalPages = (int)(Math.Ceiling(users.Count() / (double)_pageSize));
            users = users.Skip((page - 1) * _pageSize).Take(_pageSize);
            var model = new List<UserRoleVM>();
            foreach (var user in users)
            {
                var isLibrarian = await _userManager.IsInRoleAsync(user, "Librarian");
                model.Add(new UserRoleVM
                {
                    User = user,
                    IsLibrarian = isLibrarian
                });
            }

            return Ok(new
            {
                Data = users,
                Pagination = new
                {
                    CurrentPage = page,
                    TotalPages = totalPages
                }
            });
        }
    }
}
