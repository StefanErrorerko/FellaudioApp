using FellaudioApp.Models.Enums;

namespace FellaudioApp.Models
{
    public class Content
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<Point> Points { get; set; }
        public ContentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TrackId { get; set; }
        public User User { get; set; }
        public ICollection<Comment> Feed { get; set; }
        public ICollection<ContentList> ContentLists { get; set; }

    }
}
