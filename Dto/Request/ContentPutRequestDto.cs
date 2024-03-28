using FellaudioApp.Models.Enums;
using FellaudioApp.Models;

namespace FellaudioApp.Dto.Request
{
    public class ContentPutRequestDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        // чи треба?
        public ContentStatus? Status { get; set; }
    }
}
