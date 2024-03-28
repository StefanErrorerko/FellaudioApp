using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface IUserRepository
    {
        ICollection<User> GetUsers();
        User GetUser(int id);
        ICollection<Playlist> GetPlaylistsByUser(int userId);
        ICollection<Comment> GetCommentsByUser(int userId);
        ICollection<Content> GetContentsByUser(int userId);
        bool UserExists(int id);
        bool CreateUser(User user);
        bool UpdateUser(User user);
        bool DeleteUser(User user);
        bool Save();
    }
}
