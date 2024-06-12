using FellaudioApp.Models.Enums;
using FellaudioApp.Models;

namespace FellaudioApp.Dto.Request
{
    public class ContentPostRequestDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        // чи треба?
        public ContentStatus Status { get; set; }
        public string Area { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
    }
}
