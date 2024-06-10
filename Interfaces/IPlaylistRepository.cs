using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface IPlaylistRepository
    {
        ICollection<Playlist> GetPlaylists();
        Playlist GetPlaylist(int id);
        ContentPlaylist GetContentPlaylist(int playlistId, int contentId);
        ICollection<Content> GetContentsByPlaylist(int playlistId);
        bool PlaylistExists(int id);
        bool CreatePlaylist(Playlist playlist);
        bool AddContentToPlaylist(ContentPlaylist contentPlaylist);
        bool UpdatePlaylist(Playlist playlist);
        bool DeletePlaylist(Playlist playlist); 
        bool RemoveContentFromPlaylist(ContentPlaylist contentPlaylist);
        bool Save();
    }
}
