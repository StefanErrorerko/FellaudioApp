namespace FellaudioApp.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }

        public User User { get; set; }
        public Content Content { get; set; }
    }
}