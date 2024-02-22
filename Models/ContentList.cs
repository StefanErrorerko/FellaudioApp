namespace FellaudioApp.Models
{
    public class ContentList
    {
        public int UserListId { get; set; }
        public int ContentId { get; set; }
        public UserList UserList { get; set; }
        public Content Content { get; set; } 
    }
}
