using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface IPlaylistRepository
    {
        ICollection<Playlist> GetPlaylists();
        Playlist GetPlaylist(int id);
        ICollection<Content> GetContentByPlaylist(int playlistId);
        bool PlaylistExists(int id);
        bool CreatePlaylist(int contentId, Playlist playlist);
        bool Save();
    }
}
