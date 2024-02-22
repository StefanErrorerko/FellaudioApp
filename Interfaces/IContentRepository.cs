using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface IContentRepository
    {
        ICollection<Content> GetContents();
        Content GetContent(int id);
        bool ContentExists(int id);
        bool CreateContent(Content content);
        bool Save();
    }
}
