namespace FellaudioApp.Dto
{
    public class AudioFileDto
    {
        public int Id { get; set; }
        public string FileExtension { get; set; }
        public int FileSize { get; set; }
        public int DurationInSeconds { get; set; }
    }
}
