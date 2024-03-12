namespace FellaudioApp.Models
{
    public class AudioFile
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public int FileSize { get; set; }
        public int DurationInSeconds { get; set; }

        public Content Content { get; set; }
    }
}
