using FellaudioApp.Models.Enums;

namespace FellaudioApp.Models
{
    public class Content
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ContentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public AudioFile AudioFile { get; set; }
        public string Area { get; set; }
        public User User { get; set; }
        public ICollection<Point> Points { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<ContentPlaylist> ContentPlaylists { get; set; }
    }
}
