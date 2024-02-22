namespace FellaudioApp.Models
{
    public class Point
    {
        public int ContentId { get; set; }
        public int LocationId { get; set; }
        public Content Content { get; set; }
        public Location Location { get; set; }
        public int PreviousLocationId { get;set; }
        public int NextLocationId { get; set; }
    }
}
