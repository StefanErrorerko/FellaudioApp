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
            if (!dataContext.Contents.Any())
            {
                var someUser = new User()
                {
                    Name = "Someone",
                    Lastname = "Somefamily",
                    Password = "",
                    Email = "some@mail.com",
                    CreatedAt = DateTime.Now
                };

                var userLists = new List<UserList>()
                {
                    new UserList()
                    {
                        Name = "Name",
                        Description = "Description",
                        CreatedAt = DateTime.Now,
                        Type = ListType.Saved,
                        ContentLists = new List<ContentList>()
                        {
                            new ContentList()
                            {
                                Content = new Content()
                                {
                                   User = someUser,
                                   CreatedAt = DateTime.Now,
                                   Description = "Some description",
                                   Status = ContentStatus.Unpublished,
                                   Feed = new List<Comment>(){
                                       new Comment()
                                       {
                                            Author = someUser,
                                            Content = "Some Content",
                                            CreatedAt = DateTime.Now,
                                       }
                                   },
                                   Points = new List<Point>()
                                   {
                                       new Point()
                                       {
                                           Location = new Location(){ Latitude = 20, Longitude = 30, Name = "first" },
                                           PreviousLocationId = -1,
                                           NextLocationId = 1
                                       }
                                   },
                                   Title = "Title",
                                   TrackId = 1,
                                }
                            }
                        }
                    }
                };
                dataContext.UserLists.AddRange(userLists);
                dataContext.SaveChanges();
            }
        }
    }
}
