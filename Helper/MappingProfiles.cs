using AutoMapper;
using FellaudioApp.Dto.Request;
using FellaudioApp.Dto.Response;
using FellaudioApp.Models;

namespace FellaudioApp.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {

            CreateMap<Content, ContentResponseDto>()
                .ForMember(dest => dest.Points, opt => opt.MapFrom(src => src.Points));
            CreateMap<ContentPutRequestDto, Content>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));
            CreateMap<ContentPostRequestDto, Content>();

            CreateMap<User, UserResponseDto>();
            CreateMap<UserPutRequestDto, User>()
                .ForMember(dest => dest.Lastname, opt => opt.MapFrom(src => src.Lastname))
                .ForMember(dest => dest.Firstname, opt => opt.MapFrom(src => src.Firstname))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
            CreateMap<UserPostRequestDto, User>();

            CreateMap<Location, LocationResponseDto>();
            CreateMap<LocationPutRequestDto, Location>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude));
            CreateMap<LocationPostRequestDto, Location>();

            CreateMap<AudioFile, AudioFileResponseDto>();
            CreateMap<AudioFilePutRequestDto, AudioFile>()
                .ForMember(dest => dest.ContentId, opt => opt.MapFrom(src => src.ContentId))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.FileName))
                .ForMember(dest => dest.FileSize, opt => opt.MapFrom(src => src.FileSize))
                .ForMember(dest => dest.FileExtension, opt => opt.MapFrom(src => src.FileExtension))
                .ForMember(dest => dest.DurationInSeconds, opt => opt.MapFrom(src => src.DurationInSeconds));
            CreateMap<AudioFilePostRequestDto, AudioFile>();

            CreateMap<Comment, CommentResponseDto>();
            CreateMap<CommentPostRequestDto, Comment>();
            CreateMap<CommentPutRequestDto, Comment>();

            CreateMap<Playlist, PlaylistResponseDto>();
            CreateMap<PlaylistPutRequestDto, Playlist>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));
            CreateMap<PlaylistPostRequestDto, Playlist>();

            CreateMap<Point, PointResponseDto>()
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location));
            CreateMap<PointPutRequestDto, Point>()
                .ForMember(dest => dest.PreviousPointId, opt => opt.MapFrom(src => src.PreviousPointId));
            CreateMap<PointPostRequestDto, Point>();

            CreateMap<ContentPlaylistRequestDto, ContentPlaylist>();
        }
    }
}
