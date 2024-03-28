﻿using AutoMapper;
using FellaudioApp.Dto;
using FellaudioApp.Dto.Request;
using FellaudioApp.Dto.Response;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using FellaudioApp.Repository;
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
        [ProducesResponseType(200, Type = typeof(IEnumerable<PlaylistResponseDto>))]
        public IActionResult GetPlaylists()
        {
            var playlists = _mapper.Map<List<PlaylistResponseDto>>(_playlistRepository.GetPlaylists());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(playlists);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(PlaylistResponseDto))]
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
        [ProducesResponseType(200, Type = typeof(IEnumerable<ContentResponseDto>))]
        [ProducesResponseType(400)]
        public IActionResult GetContentsByPlaylist(int playlistId)
        {
            if(!_playlistRepository.PlaylistExists(playlistId))
                return NotFound();

            var contents = _mapper.Map<List<ContentResponseDto>>(_playlistRepository.GetContentByPlaylist(playlistId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(contents);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePlaylist([FromBody] PlaylistPostRequestDto playlistCreate)
        {
            if (playlistCreate == null)
                return BadRequest(ModelState);

            var userId = playlistCreate.UserId;

            if (!_userRepository.UserExists(userId))
                return NotFound();

            var playlist = _playlistRepository.GetPlaylists()
                .Where(p => p.User.Id == userId && p.Name == playlistCreate.Name)
                .FirstOrDefault();

            if(playlist != null)
            {
                ModelState.AddModelError("", $"Playlist with name {playlist.Name} already exists");
                return StatusCode(422, ModelState);
            }

            playlist = _playlistRepository.GetPlaylists()
                .Where(p => p.User.Id == userId && p.Type == Models.Enums.ListType.Saved)
                .FirstOrDefault();

            if(playlist != null && playlistCreate.Type == Models.Enums.ListType.Saved)
            {
                ModelState.AddModelError("", "Cannot create one more Saved playlist");
                return StatusCode(422, ModelState);
            }

            if(playlistCreate.Type == Models.Enums.ListType.Saved)
            {
                if(playlistCreate.Name != null)
                {
                    ModelState.AddModelError("", "Cannot create 'Saved' playlist with custom name");
                    return StatusCode(422, ModelState);
                }
                playlistCreate.Name = "Saved";
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var playlistMap = _mapper.Map<Playlist>(playlistCreate);
            playlistMap.User = _userRepository.GetUser(userId);

            if(playlistMap.CreatedAt == DateTime.MinValue)
                playlistMap.CreatedAt = DateTime.UtcNow;

            if(!_playlistRepository.CreatePlaylist(playlistMap))
            {
                ModelState.AddModelError("", "Something went wrong");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully Created");
        }

        [HttpPut("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public IActionResult UpdatePlaylist(int id, [FromBody] PlaylistPutRequestDto updatedPlaylist)
        {
            if (updatedPlaylist == null)
                return BadRequest(ModelState);

            if (!_playlistRepository.PlaylistExists(id))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest();

            var playlistToUpdate = _playlistRepository.GetPlaylist(id);
            var playlistMap = _mapper.Map(updatedPlaylist, playlistToUpdate);

            var playlistSame = _playlistRepository.GetPlaylists()
                .Where(p => p.User == playlistMap.User && p.Name == updatedPlaylist.Name && p.Id != id)
                .FirstOrDefault();

            if (playlistSame != null)
            {
                ModelState.AddModelError("", $"Playlist with name {playlistSame.Name} already exists");
                return StatusCode(422, ModelState);
            }

            if (!_playlistRepository.UpdatePlaylist(playlistMap))
            {
                ModelState.AddModelError("", "Something went wrong updating owner");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeletePlaylist(int id)
        {
            if (!_playlistRepository.PlaylistExists(id))
                return NotFound();

            var playlistToDelete = _playlistRepository.GetPlaylist(id);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_playlistRepository.DeletePlaylist(playlistToDelete))
            {
                ModelState.AddModelError("", "Something went wrong while deleting");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
