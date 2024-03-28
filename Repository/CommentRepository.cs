using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.EntityFrameworkCore;

namespace FellaudioApp.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly DataContext _context;
        public CommentRepository(DataContext context)
        {
            _context = context;
        }
        public bool CommentExists(int id)
        {
            return _context.Comments.Any(c => c.Id == id);
        }
        public Comment GetComment(int id)
        {
            return _context.Comments
                .Where(c => c.Id == id)
                .Include(c => c.Content)
                .Include(c => c.User)
                .FirstOrDefault();
        }
        public ICollection<Comment> GetComments()
        {
            return _context.Comments
                .OrderBy(c => c.Id)
                .Include(c => c.Content)
                .Include(c => c.User)
                .ToList();
        }
        public bool CreateComment(Comment comment)
        {
            _context.Add(comment);
            return Save();
        }
        public bool UpdateComment(Comment comment)
        {
            // костиль
            var existingComment = _context.Comments.Local.FirstOrDefault(c => c.Id == comment.Id)
                ?? _context.Comments.FirstOrDefault(c => c.Id == comment.Id);
            if(existingComment != null)
                _context.Entry(existingComment).State = EntityState.Detached;

            _context.Update(comment);
            return Save();
        }
        public bool DeleteComment(Comment comment)
        {
            _context.Remove(comment);
            return Save();
        }
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }  
    }
}
