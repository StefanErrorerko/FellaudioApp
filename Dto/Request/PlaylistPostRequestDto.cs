using FellaudioApp.Models.Enums;
using FellaudioApp.Models;

namespace FellaudioApp.Dto.Request
{
    public class PlaylistPostRequestDto
    {
        public string? Name { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public ListType Type { get; set; }
        public int UserId { get; set; }
    }
}
