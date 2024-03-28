using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;

namespace FellaudioApp.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public bool UserExists(int id)
        {
            return _context.Users.Any(u => u.Id == id);
        }
        public ICollection<Comment> GetCommentsByUser(int userId)
        {
            return _context.Comments
                .Include(c => c.User)
                .Where(c => c.User.Id == userId).ToList();
        }
        public ICollection<Content> GetContentsByUser(int userId)
        {
            return _context.Contents
                .Include(c => c.User)
                .Include(c => c.AudioFile)
                .Include(c => c.Points)
                .Include(c => c.Comments)
                .Where(c => c.User.Id == userId).ToList();
        }
        public ICollection<Playlist> GetPlaylistsByUser(int userId)
        {
            return _context.Playlists
                .Include(p => p.User)
                .Where(p => p.User.Id == userId).ToList();
        }
        public User GetUser(int id)
        {
            return _context.Users.Where(u => u.Id == id).FirstOrDefault();
        }
        public ICollection<User> GetUsers()
        {
            return _context.Users.OrderBy(u => u.Id).ToList();
        }        
        public bool CreateUser(User user)
        {
            _context.Add(user);
            return Save();
        }
        public bool UpdateUser(User user)
        {
            _context.Update(user);
            return Save();
        }
        public bool DeleteUser(User user)
        {
            _context.Remove(user);
            return Save();
        }
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
