namespace FellaudioApp.Models
{
    public class Point
    {
        public int Id { get; set; }
        public Location Location { get; set; }

        public Content Content { get; set; }
        public int? PreviousPointId { get; set; }
        public Point PreviousPoint { get; set; }
        public Point NextPoint { get; set; }
    }
}
