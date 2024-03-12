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

            modelBuilder.Entity<AudioFile>()
                .HasOne(a => a.Content)
                .WithOne(c => c.AudioFile)
                .HasForeignKey<Content>(c => c.AudioFileId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.User)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Contents)
                .WithOne(c => c.User)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Point>()
                .HasOne(pp => pp.NextPoint)
                .WithOne(p => p.PreviousPoint)
                .HasForeignKey<Point>(p => p.PreviousPointId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .IsRequired(false);
        }
    }
}
