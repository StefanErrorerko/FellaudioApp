using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.EntityFrameworkCore;

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
        public Content GetContent(int id)
        {
            return _context.Contents
                .Where(c => c.Id == id)
                .Include(c => c.User)
                .Include(c => c.Points)
                .ThenInclude(comment => comment.Location)
                .Include(c => c.AudioFile)
                .Include(c => c.Comments)
                .ThenInclude(comment => comment.User)
                .FirstOrDefault();
        }
        public ICollection<Content> GetContents()
        {
            return _context.Contents
                .Include(c => c.User)
                .Include(c => c.Points)
                .ThenInclude(comment => comment.Location)
                .Include(c => c.AudioFile)
                .Include(c => c.Comments)
                .ThenInclude(comment => comment.User) 
                .OrderBy(c => c.Id)
                .ToList();
        }
        public ICollection<Point> GetPointsByContent(int contentId)
        {
            return _context.Points
                .Include(p => p.Location)
                .Where(p => p.Content.Id == contentId)
                .ToList();
        }
        public AudioFile GetAudioFileByContent(int contentId)
        {
            return _context.AudioFiles.Where(a => a.ContentId == contentId).FirstOrDefault();
        }
        public ICollection<Comment> GetCommentsByContent(int contentId)
        {
            return _context.Comments
                .Include(c => c.User)
                .Where(c => c.Content.Id == contentId)
                .ToList();
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
        public bool UpdateContent(Content content)
        {
            // костиль
            var existingContent = _context.Contents.Local.FirstOrDefault(c => c.Id == content.Id)
                ?? _context.Contents.FirstOrDefault(c => c.Id == content.Id);
            _context.Entry(existingContent).State = EntityState.Detached;

            _context.Update(content);
            return Save();
        }
        public bool DeleteContent(Content content)
        {
            _context.Remove(content);
            return Save();
        }
        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
