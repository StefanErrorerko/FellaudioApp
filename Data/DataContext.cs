using FellaudioApp.Models;
using Microsoft.EntityFrameworkCore;

namespace FellaudioApp.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) 
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Content> Contents { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<ContentList> ContentLists { get; set; }
        public DbSet<Point> Points { get; set; }
        public DbSet<UserList> UserLists { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ContentList>()
                .HasKey(cl => new { cl.ContentId, cl.UserListId });
            modelBuilder.Entity<ContentList>()
                .HasOne(c => c.Content)
                .WithMany(cl => cl.ContentLists)
                .HasForeignKey(c => c.ContentId);

            modelBuilder.Entity<ContentList>()
                .HasOne(l => l.UserList)
                .WithMany(cl => cl.ContentLists)
                .HasForeignKey(l => l.UserListId);

            modelBuilder.Entity<Point>()
                .HasKey(p => new { p.LocationId, p.ContentId });
            modelBuilder.Entity<Point>()
                .HasOne(l => l.Location)
                .WithMany(p => p.Points)
                .HasForeignKey(l => l.LocationId);

            modelBuilder.Entity<Point>()
                .HasOne(c => c.Content)
                .WithMany(p => p.Points)
                .HasForeignKey(c => c.ContentId);
        }
    }
}
