using AutoMapper;
using FellaudioApp.Dto;
using FellaudioApp.Models;
using System.Runtime;

namespace FellaudioApp.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Content, ContentDto>();
            CreateMap<ContentDto, Content>();

            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

            CreateMap<Location, LocationDto>();
            CreateMap<LocationDto, Location>();

            CreateMap<AudioFile, AudioFileDto>();
            CreateMap<AudioFileDto, AudioFile>();

            CreateMap<Comment, CommentDto>();
            CreateMap<CommentDto, Comment>();

            CreateMap<Playlist, PlaylistDto>();
            CreateMap<PlaylistDto, Playlist>();

            CreateMap<Point, PointDto>();
            CreateMap<PointDto, Point>();
        }
    }
}
