namespace FellaudioApp.Models
{
    public class ContentPlaylist
    {
        public int PlaylistId { get; set; }
        public int ContentId { get; set; }
        public Playlist Playlist { get; set; }
        public Content Content { get; set; } 
    }
}
