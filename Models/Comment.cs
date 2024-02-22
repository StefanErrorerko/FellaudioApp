namespace FellaudioApp.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public User Author { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}