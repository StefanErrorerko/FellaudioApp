using FellaudioApp.Models.Enums;
using FellaudioApp.Models;

namespace FellaudioApp.Dto.Response
{
    public class PlaylistResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public ListType Type { get; set; }
        public UserResponseDto User { get; set; }
        public List<ContentResponseDto> Contents { get; set; }
    }
}
