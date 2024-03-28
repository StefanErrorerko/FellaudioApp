using FellaudioApp.Models;

namespace FellaudioApp.Dto.Request
{
    public class PointPostRequestDto
    {
        public int LocationId { get; set; }
        public int ContentId { get; set; }
        public int? PreviousPointId { get; set; }
    }
}
