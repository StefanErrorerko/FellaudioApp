namespace FellaudioApp.Dto.Response
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
