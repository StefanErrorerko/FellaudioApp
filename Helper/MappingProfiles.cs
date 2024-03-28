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

            CreateMap<Content, ContentResponseDto>();
            CreateMap<ContentPutRequestDto, Content>()
                .ForMember(dest => dest.Status, opt => opt.Condition(src => src.Status != null))
                .ForMember(dest => dest.Title, opt => opt.Condition(src => src.Title != null))
                .ForMember(dest => dest.Description, opt => opt.Condition(src => src.Description != null));
            CreateMap<ContentPostRequestDto, Content>();

            CreateMap<User, UserResponseDto>();
            CreateMap<UserPutRequestDto, User>()
                .ForMember(dest => dest.Lastname, opt => opt.Condition(src => src.Lastname != null))
                .ForMember(dest => dest.Firstname, opt => opt.Condition(src => src.Firstname != null))
                .ForMember(dest => dest.Email, opt => opt.Condition(src => src.Email != null));
            CreateMap<UserPostRequestDto, User>();

            CreateMap<Location, LocationResponseDto>();
            CreateMap<LocationPutRequestDto, Location>()
                .ForMember(dest => dest.Name, opt => opt.Condition(src => src.Name != null))
                .ForMember(dest => dest.Longitude, opt => opt.Condition(src => src.Longitude != null))
                .ForMember(dest => dest.Latitude, opt => opt.Condition(src => src.Latitude != null));
            CreateMap<LocationPostRequestDto, Location>();

            CreateMap<AudioFile, AudioFileResponseDto>();
            CreateMap<AudioFilePutRequestDto, AudioFile>()
                .ForMember(dest => dest.ContentId, opt => opt.Condition(src => src.ContentId != null))
                .ForMember(dest => dest.FileName, opt => opt.Condition(src => src.FileName != null))
                .ForMember(dest => dest.FileSize, opt => opt.Condition(src => src.FileSize != null))
                .ForMember(dest => dest.FileExtension, opt => opt.Condition(src => src.FileExtension != null))
                .ForMember(dest => dest.DurationInSeconds, opt => opt.Condition(src => src.DurationInSeconds != null));
            CreateMap<AudioFilePostRequestDto, AudioFile>();

            CreateMap<Comment, CommentResponseDto>();
            CreateMap<CommentPostRequestDto, Comment>();
            CreateMap<CommentPutRequestDto, Comment>();

            CreateMap<Playlist, PlaylistResponseDto>();
            CreateMap<PlaylistPutRequestDto, Playlist>()
                .ForMember(dest => dest.Name, opt => opt.Condition(src => src.Name != null))
                .ForMember(dest => dest.Description, opt => opt.Condition(src => src.Description != null));
            CreateMap<PlaylistPostRequestDto, Playlist>();

            CreateMap<Point, PointResponseDto>();
            CreateMap<PointPutRequestDto, Point>()
                .ForMember(dest => dest.PreviousPointId, opt => opt.Condition(src => src.PreviousPointId != null));
            CreateMap<PointPostRequestDto, Point>();
        }
    }
}
