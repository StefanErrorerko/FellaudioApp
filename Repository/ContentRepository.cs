using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;

namespace FellaudioApp.Repository
{
    public class ContentRepository : IContentRepository
    {
        private readonly DataContext _context;
        public ContentRepository(DataContext context) 
        {
            _context = context;
        }

        public bool ContentExists(int id)
        {
            return _context.Contents.Any(c => c.Id == id);
        }

        public bool CreateContent(Content content)
        {
            /*var userListEntity = _context.UserLists.Where(ul => ul.Id == userListId).FirstOrDefault();

            var contentList = new ContentList()
            {
                UserList = userListEntity,
                Content = content
            };

            _context.Add(contentList);*/

            _context.Add(content);

            return Save();
        }

        public Content GetContent(int id)
        {
            return _context.Contents.Where(c => c.Id == id).FirstOrDefault();
        }

        public ICollection<Content> GetContents()
        {
            return _context.Contents.OrderBy(c => c.Id).ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
