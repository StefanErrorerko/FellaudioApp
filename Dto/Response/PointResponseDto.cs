using FellaudioApp.Models;

namespace FellaudioApp.Dto.Response
{
    public class PointResponseDto
    {
        public int Id { get; set; }
        public LocationResponseDto Location { get; set; }
        public int PreviousPointId { get; set; }
    }
}
