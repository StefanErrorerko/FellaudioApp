using FellaudioApp.Models;

namespace FellaudioApp.Dto.Response
{
    public class CommentResponseDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserResponseDto User { get; set; }
    }
}
