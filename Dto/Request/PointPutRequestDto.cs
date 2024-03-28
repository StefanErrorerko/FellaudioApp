using FellaudioApp.Models;

namespace FellaudioApp.Dto.Request
{
    public class PointPutRequestDto
    {
        public int? LocationId { get; set; }
        public int? PreviousPointId { get; set; }
    }
}
