using FellaudioApp.Models.Enums;

namespace FellaudioApp.Models
{
    public class UserList
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public ListType Type { get; set; }
        public string UserId { get; set; }
        public ICollection<ContentList> ContentLists { get; set; }
    }
}
