namespace FellaudioApp.Dto.Request
{
    public class UserPostRequestDto
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
    }
}
