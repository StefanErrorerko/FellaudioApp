using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface ICommentRepository
    {
        ICollection<Comment> GetComments();
        Comment GetComment(int id);
        bool CommentExists(int id);
        bool CreateComment(Comment comment);
        bool Save();
    }
}
