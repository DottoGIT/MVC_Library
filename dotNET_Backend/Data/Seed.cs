using MVC_Library.Models;
using MVC_Library.Data.Enums;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace MVC_Library.Data
{
    public class Seed
    {
        public static void SeedData(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<AppDatabaseContext>();
                if (context == null) return;

                context.Database.EnsureCreated();

                /* -----------------------------------------------/*
                /*                  Fill Books                    /*
                /* -----------------------------------------------*/

                if (!context.Books.Any())
                {
                    context.Books.AddRange(new List<Book>()
                    {
                        new Book()
                        {
                            Author = "J.K. Rowling",
                            Publisher = "Bloomsbury",
                            Title = "Harry Potter and the Philosopher's Stone",
                            YearOfPublication = 1997,
                            Price = 39.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "George Orwell",
                            Publisher = "Secker & Warburg",
                            Title = "1984",
                            YearOfPublication = 1949,
                            Price = 29.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "F. Scott Fitzgerald",
                            Publisher = "Charles Scribner's Sons",
                            Title = "The Great Gatsby",
                            YearOfPublication = 1925,
                            Price = 24.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Harper Lee",
                            Publisher = "J.B. Lippincott & Co.",
                            Title = "To Kill a Mockingbird",
                            YearOfPublication = 1960,
                            Price = 19.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "J.R.R. Tolkien",
                            Publisher = "George Allen & Unwin",
                            Title = "The Hobbit",
                            YearOfPublication = 1937,
                            Price = 34.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "C.S. Lewis",
                            Publisher = "Geoffrey Bles",
                            Title = "The Lion, the Witch and the Wardrobe",
                            YearOfPublication = 1950,
                            Price = 29.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Jane Austen",
                            Publisher = "T. Egerton",
                            Title = "Pride and Prejudice",
                            YearOfPublication = 1813,
                            Price = 22.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Mark Twain",
                            Publisher = "Chatto & Windus",
                            Title = "The Adventures of Tom Sawyer",
                            YearOfPublication = 1876,
                            Price = 18.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Leo Tolstoy",
                            Publisher = "The Russian Messenger",
                            Title = "War and Peace",
                            YearOfPublication = 1869,
                            Price = 49.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Gabriel García Márquez",
                            Publisher = "Editorial Oveja Negra",
                            Title = "One Hundred Years of Solitude",
                            YearOfPublication = 1967,
                            Price = 39.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Charles Dickens",
                            Publisher = "Chapman & Hall",
                            Title = "A Tale of Two Cities",
                            YearOfPublication = 1859,
                            Price = 29.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Herman Melville",
                            Publisher = "Harper & Brothers",
                            Title = "Moby-Dick",
                            YearOfPublication = 1851,
                            Price = 27.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Mary Shelley",
                            Publisher = "Lackington, Hughes, Harding, Mavor & Jones",
                            Title = "Frankenstein",
                            YearOfPublication = 1818,
                            Price = 17.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "H.G. Wells",
                            Publisher = "William Heinemann",
                            Title = "The War of the Worlds",
                            YearOfPublication = 1898,
                            Price = 23.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Fyodor Dostoevsky",
                            Publisher = "The Russian Messenger",
                            Title = "Crime and Punishment",
                            YearOfPublication = 1866,
                            Price = 29.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Miguel de Cervantes",
                            Publisher = "Francisco de Robles",
                            Title = "Don Quixote",
                            YearOfPublication = 1605,
                            Price = 31.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "William Shakespeare",
                            Publisher = "Edward Blount & William Jaggard",
                            Title = "Hamlet",
                            YearOfPublication = 1603,
                            Price = 25.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Homer",
                            Publisher = "Ancient Greece",
                            Title = "The Odyssey",
                            YearOfPublication = -800,
                            Price = 42.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Ernest Hemingway",
                            Publisher = "Charles Scribner's Sons",
                            Title = "The Old Man and the Sea",
                            YearOfPublication = 1952,
                            Price = 20.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "J.D. Salinger",
                            Publisher = "Little, Brown and Company",
                            Title = "The Catcher in the Rye",
                            YearOfPublication = 1951,
                            Price = 19.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Aldous Huxley",
                            Publisher = "Chatto & Windus",
                            Title = "Brave New World",
                            YearOfPublication = 1932,
                            Price = 28.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Jack London",
                            Publisher = "Macmillan",
                            Title = "The Call of the Wild",
                            YearOfPublication = 1903,
                            Price = 18.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Ray Bradbury",
                            Publisher = "Ballantine Books",
                            Title = "Fahrenheit 451",
                            YearOfPublication = 1953,
                            Price = 22.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "George R.R. Martin",
                            Publisher = "Bantam Books",
                            Title = "A Game of Thrones",
                            YearOfPublication = 1996,
                            Price = 49.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Margaret Atwood",
                            Publisher = "McClelland and Stewart",
                            Title = "The Handmaid's Tale",
                            YearOfPublication = 1985,
                            Price = 33.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Jules Verne",
                            Publisher = "Pierre-Jules Hetzel",
                            Title = "Twenty Thousand Leagues Under the Sea",
                            YearOfPublication = 1870,
                            Price = 27.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Virginia Woolf",
                            Publisher = "Hogarth Press",
                            Title = "To the Lighthouse",
                            YearOfPublication = 1927,
                            Price = 29.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Franz Kafka",
                            Publisher = "Kurt Wolff Verlag",
                            Title = "The Trial",
                            YearOfPublication = 1925,
                            Price = 24.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Dante Alighieri",
                            Publisher = "John Murray",
                            Title = "The Divine Comedy",
                            YearOfPublication = 1320,
                            Price = 44.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Arthur Conan Doyle",
                            Publisher = "Ward, Lock & Co.",
                            Title = "A Study in Scarlet",
                            YearOfPublication = 1887,
                            Price = 18.99m,
                            IsPernamentlyUnavailable = false
                        },
                        new Book()
                        {
                            Author = "Victor Hugo",
                            Publisher = "A. Lacroix, Verboeckhoven & Cie",
                            Title = "Les Misérables",
                            YearOfPublication = 1862,
                            Price = 39.99m,
                            IsPernamentlyUnavailable = false
                        }
                    });
                }

                context.SaveChanges();
            }
        }


        public static async Task SeedUsers(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<User>>();

                string adminUserEmail = "admin@wp.pl";
                var adminUser = await userManager.FindByEmailAsync(adminUserEmail);
                if (adminUser == null)
                {
                    var newAdminUser = new User()
                    {
                        FirstName = "Maciej",
                        LastName = "Scheffer",
                        UserName = "admin",
                        Email = adminUserEmail,
                        EmailConfirmed = true,
                        Role = UserRole.Librarian
                    };
                    await userManager.CreateAsync(newAdminUser, "Hasło1234$");
                }

                string admin2UserEmail = "admin2@wp.pl";
                var admin2User = await userManager.FindByEmailAsync(admin2UserEmail);
                if (admin2User == null)
                {
                    var newAdmin2User = new User()
                    {
                        FirstName = "Roman",
                        LastName = "Romański",
                        UserName = "admin2",
                        Email = admin2UserEmail,
                        EmailConfirmed = true,
                        Role = UserRole.Librarian
                    };
                    await userManager.CreateAsync(newAdmin2User, "Hasło1234$");
                }

                string appUserEmail = "stachstrach@gmail.pl";
                var appUser = await userManager.FindByEmailAsync(appUserEmail);
                if (appUser == null)
                {
                    var newAppUser = new User()
                    {
                        UserName = "stach",
                        FirstName = "Staś",
                        LastName = "Tatar",
                        Email = appUserEmail,
                        EmailConfirmed = true,
                        Role = UserRole.User
                    };
                    await userManager.CreateAsync(newAppUser, "Hasło4321$");

                }
            }
        }


    }
}
