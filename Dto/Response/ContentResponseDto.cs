using FellaudioApp.Models.Enums;
using FellaudioApp.Models;

namespace FellaudioApp.Dto.Response
{
    public class ContentResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ContentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Area { get; set; }
        public UserResponseDto User { get; set; }
        public List<PointResponseDto> Points { get; set; }
        public List<CommentResponseDto> Comments { get; set; }
        public AudioFileResponseDto AudioFile { get; set; }
    }
}
