using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;

namespace FellaudioApp.Repository
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly DataContext _context;

        public PlaylistRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreatePlaylist(int contentId, Playlist playlist)
        {
            var contentEntity = _context.Contents.Where(c => c.Id == contentId).FirstOrDefault();

            var contentPlaylist = new ContentPlaylist()
            {
                Content = contentEntity,
                Playlist = playlist
            };

            _context.Add(contentPlaylist);

            _context.Add(playlist);
            return Save();
        }

        public ICollection<Content> GetContentByPlaylist(int playlistId)
        {
            return _context.ContentPlaylists.Where(cp => cp.Playlist.Id == playlistId).Select(cp => cp.Content).ToList();
        }

        public Playlist GetPlaylist(int id)
        {
            return _context.Playlists.Where(p => p.Id == id).FirstOrDefault();
        }

        public ICollection<Playlist> GetPlaylists()
        {
            return _context.Playlists.OrderBy(p => p.Id).ToList();
        }

        public bool PlaylistExists(int id)
        {
            return _context.Playlists.Any(p => p.Id == id);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
