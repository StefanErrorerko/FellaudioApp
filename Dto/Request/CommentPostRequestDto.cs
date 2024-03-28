using FellaudioApp.Models;

namespace FellaudioApp.Dto.Request
{
    public class CommentPostRequestDto
    {
        public string Text { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int UserId { get; set; }
        public int ContentId { get; set; }
    }
}
