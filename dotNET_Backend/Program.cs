using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MVC_Library.Data;
using MVC_Library.Data.Interfaces;
using MVC_Library.Models;
using MVC_Library.Repository;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILeaseRepository, LeaseRepository>();
builder.Services.AddHostedService<LeaseUpdaterService>();

builder.Services.AddDbContext<AppDatabaseContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // Allow requests from React app running on port 3000
              .AllowAnyHeader()                      // Allow any header in the request
              .AllowAnyMethod();                     // Allow any HTTP method (GET, POST, etc.)
    });
});


builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDatabaseContext>();
builder.Services.AddMemoryCache();
builder.Services.AddSession();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();

var app = builder.Build();

//using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
//{
//    var logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<Program>>();
//    var db = serviceScope.ServiceProvider.GetRequiredService<AppDatabaseContext>().Database;

//    logger.LogInformation("Migrating database...");
//    while (!db.CanConnect())
//    {
//        logger.LogInformation("Database not ready yet; waiting...");
//        Thread.Sleep(1000);
//    }

//    try
//    {
//        serviceScope.ServiceProvider.GetRequiredService<AppDatabaseContext>().Database.Migrate();
//        logger.LogInformation("Database migrated successfully.");
//    }
//    catch (Exception ex)
//    {
//        logger.LogError(ex, "An error occurred while migrating the database.");
//    }
//}

await Seed.SeedUsersAndRolesAsync(app);
Seed.SeedData(app);


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowReactApp");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
