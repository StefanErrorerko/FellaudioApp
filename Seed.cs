using FellaudioApp.Data;
using FellaudioApp.Models;
using FellaudioApp.Models.Enums;
using System.Diagnostics.Metrics;

namespace FellaudioApp
{
    public class Seed
    {
        private readonly DataContext dataContext;
        public Seed(DataContext context)
        {
            this.dataContext = context;
        }
        public void SeedDataContext()
        {
            if (!dataContext.Users.Any())
            {
                var users = new List<User>()
                {
                    new User()
                    {
                        Firstname = "Abuba",
                        Lastname = "Gamubabe",
                        Email = "nail@mail.com",
                        HashedPassword = "Password",
                        Playlists = new List<Playlist>()
                        {
                            new Playlist()
                            {
                                Name = "MyFirstPlaylist",
                                Description = "mine!",
                                CreatedAt = DateTime.Now,
                                Type = ListType.Created,
                                ContentPlaylists = new List<ContentPlaylist>()
                                {
                                    new ContentPlaylist()
                                    {
                                        Content = new Content()
                                        {
                                            Title = "My first one",
                                            Description = "cool!",
                                            AudioFile = new AudioFile()
                                            {
                                                FileExtension = "wav",
                                                FileName = "prek",
                                                FileSize = 15,
                                                DurationInSeconds = 400
                                            },
                                            User = new User()
                                            {
                                                Firstname = "Akakii",
                                                Lastname = "Anatolich",
                                                Comments = null,
                                                CreatedAt = DateTime.Now,
                                                Email = "mail@mail.com",
                                                HashedPassword = "sdhgkjwhjb2k",
                                                Playlists = null
                                            },
                                            Comments = new List<Comment>()
                                            {
                                                new Comment()
                                                {
                                                    Text = "Uraa",
                                                    User = new User()
                                                    {
                                                        Firstname = "Andrii",
                                                        Lastname = "Smishniavkin",
                                                        HashedPassword = "sfvdsbdfds",
                                                        Email = "f@g.com"
                                                    },
                                                    CreatedAt = DateTime.Now
                                                }
                                            },
                                            Status = ContentStatus.Editable,
                                            CreatedAt = DateTime.Now
                                        }
                                    }
                                }
                            }
                        },
                        CreatedAt = DateTime.Now
                    }
                };

                dataContext.Users.AddRange(users);
                dataContext.SaveChanges();
            }
        }
    }
}
