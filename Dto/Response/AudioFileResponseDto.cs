using FellaudioApp.Models;

namespace FellaudioApp.Dto.Response
{
    public class AudioFileResponseDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public int FileSize { get; set; }
        public int DurationInSeconds { get; set; }
    }
}
