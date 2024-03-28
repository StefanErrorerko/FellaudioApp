using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface IContentRepository
    {
        ICollection<Content> GetContents();
        Content GetContent(int id);
        AudioFile GetAudioFileByContent(int contentId);
        ICollection<Point> GetPointsByContent(int contentId);
        ICollection<Comment> GetCommentsByContent(int contentId);
        bool ContentExists(int id);
        bool CreateContent(Content content);
        bool UpdateContent(Content content);
        bool DeleteContent(Content content);
        bool Save();
    }
}
