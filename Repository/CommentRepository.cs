using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;

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

        public bool CreateComment(Comment comment)
        {
            _context.Add(comment);
            return Save();
        }

        public Comment GetComment(int id)
        {
            return _context.Comments.Where(c => c.Id == id).FirstOrDefault();
        }

        public ICollection<Comment> GetComments()
        {
            return _context.Comments.OrderBy(c => c.Id).ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
