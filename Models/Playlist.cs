using FellaudioApp.Models.Enums;

namespace FellaudioApp.Models
{
    public class Playlist
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public ListType Type { get; set; }

        public User User { get; set; }
        public ICollection<ContentPlaylist> ContentPlaylists { get; set; }
    }
}
