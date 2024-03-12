using FellaudioApp.Models;

namespace FellaudioApp.Dto
{
    public class PointDto
    {
        public int Id { get; set; }
        public Location Location { get; set; }
        public int PreviousPointId { get; set; }
    }
}
