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
            CreateMap<Location, LocationDto>();
        }
    }
}
