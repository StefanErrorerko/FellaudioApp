namespace FellaudioApp.Dto.Request
{
    public class AudioFilePutRequestDto
    {
        public string? FileName { get; set; }
        public string? FileExtension { get; set; }
        public int? FileSize { get; set; }
        public int? DurationInSeconds { get; set; }
        public int? ContentId { get; set; }
    }
}
