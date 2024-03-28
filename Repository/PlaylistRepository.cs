using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.EntityFrameworkCore;

namespace FellaudioApp.Repository
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly DataContext _context;

        public PlaylistRepository(DataContext context)
        {
            _context = context;
        }


        public bool PlaylistExists(int id)
        {
            return _context.Playlists.Any(p => p.Id == id);
        }
        public ICollection<Content> GetContentByPlaylist(int playlistId)
        {
            return _context.ContentPlaylists
                .Where(cp => cp.Playlist.Id == playlistId)
                .Select(cp => cp.Content)
                .Include(c => c.User)
                .Include(c => c.Points)
                .Include(c => c.AudioFile)
                .Include(c => c.Comments)
                .ToList();
        }
        public Playlist GetPlaylist(int id)
        {
            return _context.Playlists
                .Where(p => p.Id == id)
                .Include(p => p.User)
                .FirstOrDefault();
        }
        public ICollection<Playlist> GetPlaylists()
        {
            return _context.Playlists
                .Include(p => p.User)
                .OrderBy(p => p.Id)
                .ToList();
        }
        public bool CreatePlaylist(Playlist playlist)
        {
            /*var contentEntity = _context.Contents.Where(c => c.Id == contentId).FirstOrDefault();

            var contentPlaylist = new ContentPlaylist()
            {
                Content = contentEntity,
                Playlist = playlist
            };

            _context.Add(contentPlaylist);*/

            _context.Add(playlist);
            return Save();
        }
        public bool UpdatePlaylist(Playlist playlist)
        {
            var existingPlaylist = _context.Playlists.Local.FirstOrDefault(p => p.Id == playlist.Id)
                ?? _context.Playlists.FirstOrDefault(p => p.Id == playlist.Id);
            // костиль
            _context.Entry(existingPlaylist).State = EntityState.Detached;

            _context.Update(playlist);
            return Save();
        }
        public bool DeletePlaylist(Playlist playlist)
        {
            _context.Remove(playlist); 
            return Save();
        }
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
