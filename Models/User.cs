namespace FellaudioApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Playlist> Playlists { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Content> Contents { get; set; }
    }
}
