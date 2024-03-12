using AutoMapper;
using FellaudioApp.Dto;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace FellaudioApp.Controllers
{
    [Route("api/[controller]")]
    [Controller]
    public class PlaylistController : Controller
    {
        private readonly IPlaylistRepository _playlistRepository;
        private readonly IUserRepository _userRepository;
        private readonly IContentRepository _contentRepository;
        private readonly IMapper _mapper;

        public PlaylistController(IPlaylistRepository playlistRepository, IUserRepository userRepository, 
            IMapper mapper, IContentRepository contentRepository)
        {
            _playlistRepository = playlistRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _contentRepository = contentRepository;

        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<PlaylistDto>))]
        public IActionResult GetPlaylists()
        {
            var playlists = _mapper.Map<List<PlaylistDto>>(_playlistRepository.GetPlaylists());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(playlists);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(PlaylistDto))]
        [ProducesResponseType(400)]
        public IActionResult GetPlaylist(int id)
        {
            if (!_playlistRepository.PlaylistExists(id))
                return NotFound();

            var playlist = _mapper.Map<Playlist>(_playlistRepository.GetPlaylist(id));

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(playlist);
        }

        [HttpGet("{playlistId}/content")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ContentDto>))]
        [ProducesResponseType(400)]
        public IActionResult GetContentByPlaylist(int playlistId)
        {
            if(!_playlistRepository.PlaylistExists(playlistId))
                return NotFound();

            var contents = _mapper.Map<List<ContentDto>>(_playlistRepository.GetContentByPlaylist(playlistId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(contents);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePlaylist([FromQuery] int contentId, [FromQuery] int userId, [FromBody] PlaylistDto playlistCreate)
        {
            if (playlistCreate == null)
                return BadRequest(ModelState);

            var user = _userRepository.GetUser(userId);

            var playlist = _playlistRepository.GetPlaylists()
                .Where(p => p.User == user && p.Name == playlistCreate.Name)
                .FirstOrDefault();

            if(playlist != null)
            {
                ModelState.AddModelError("", $"Playlist with name {playlist.Name} already exists");
                return StatusCode(422, ModelState);
            }

            playlist = _playlistRepository.GetPlaylists()
                .Where(p => p.User == user && p.Type == Models.Enums.ListType.Saved)
                .FirstOrDefault();

            if(playlist != null && playlistCreate.Type == Models.Enums.ListType.Saved)
            {
                ModelState.AddModelError("", "Cannot create one more Saved playlist");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var playlistMap = _mapper.Map<Playlist>(playlistCreate);

            playlistMap.User = user;
            if(playlistMap.CreatedAt == DateTime.MinValue)
                playlistMap.CreatedAt = DateTime.UtcNow;

            if(!_playlistRepository.CreatePlaylist(contentId, playlistMap))
            {
                ModelState.AddModelError("", "Something went wrong");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully Created");
        }
    }
}
