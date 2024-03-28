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
        public DbSet<ContentPlaylist> ContentPlaylists { get; set; }
        public DbSet<Point> Points { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<AudioFile> AudioFiles { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ContentPlaylist>()
                .HasKey(cp => new { cp.ContentId, cp.PlaylistId });

            modelBuilder.Entity<ContentPlaylist>()
                .HasOne(c => c.Content)
                .WithMany(cp => cp.ContentPlaylists)
                .HasForeignKey(c => c.ContentId);

            modelBuilder.Entity<ContentPlaylist>()
                .HasOne(p => p.Playlist)
                .WithMany(cp => cp.ContentPlaylists)
                .HasForeignKey(p => p.PlaylistId);

            modelBuilder.Entity<Content>()
                .HasOne(c => c.AudioFile)
                .WithOne(a => a.Content)
                .HasForeignKey<AudioFile>(c => c.ContentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.User)
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Contents)
                .WithOne(c => c.User)
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);

            modelBuilder.Entity<Point>()
                .HasOne(pp => pp.NextPoint)
                .WithOne(p => p.PreviousPoint)
                .HasForeignKey<Point>(p => p.PreviousPointId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .IsRequired(false);

            modelBuilder.Entity<Comment>()
                .HasOne(com => com.Content)
                .WithMany(con => con.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Point>()
                .HasOne(p => p.Content)
                .WithMany(c => c.Points)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Playlists)
                .WithOne(p => p.User)
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
        }
    }
}
