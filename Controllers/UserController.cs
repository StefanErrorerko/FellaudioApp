﻿using AutoMapper;
using FellaudioApp.Dto;
using FellaudioApp.Dto.Request;
using FellaudioApp.Dto.Response;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using FellaudioApp.RecommenderSystem;
using FellaudioApp.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FellaudioApp.Controllers
{
    [Route("api/[controller]")]
    [Controller]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IContentRepository _contentRepository;
        private readonly IMapper _mapper;
        public UserController(IUserRepository userRepository, IContentRepository contentRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _contentRepository = contentRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserResponseDto>))]
        public IActionResult GetUsers()
        {

            var users = _mapper.Map<List<UserResponseDto>>(_userRepository.GetUsers());

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(users);
        }

        [HttpPost("check")]
        [ProducesResponseType(200, Type = typeof(UserResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetUserByEmailAndPassword([FromBody] LoginRequestDto loginRequest)
        {
            var user = _mapper.Map<UserResponseDto>(_userRepository.GetUserByEmailAndPassword(loginRequest.Email, loginRequest.HashedPassword));

            if (user == null)
                return NotFound();

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(UserResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetUser(int id)
        {
            if (!_userRepository.UserExists(id))
                return NotFound();

            var user = _mapper.Map<UserResponseDto>(_userRepository.GetUser(id));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }


        [HttpGet("{userId}/playlists")]
        [ProducesResponseType(200, Type = typeof(PlaylistResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetPlaylistsByUser(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var playlists = _mapper.Map<List<PlaylistResponseDto>>(_userRepository.GetPlaylistsByUser(userId));

            if (!ModelState.IsValid)
                return BadRequest();

            return Ok(playlists);
        }

        [HttpGet("{userId}/playlist/saved")]
        [ProducesResponseType(200, Type = typeof(PlaylistResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetPlaylistSavedByUser(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var playlistSaved = _mapper.Map<PlaylistResponseDto>(_userRepository.GetPlaylistSavedByUser(userId));

            if (playlistSaved == null)
                return NotFound();
            
            if (!ModelState.IsValid)
                return BadRequest();

            return Ok(playlistSaved);
        }

        [HttpGet("{userId}/comments")]
        [ProducesResponseType(200, Type = typeof(CommentResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetCommentsByUser(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var comments = _mapper.Map<List<CommentResponseDto>>(_userRepository.GetCommentsByUser(userId));

            if (!ModelState.IsValid)
                return BadRequest();

            return Ok(comments);
        }

        [HttpGet("{userId}/contents")]
        [ProducesResponseType(200, Type = typeof(CommentResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetContentsByUser(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var contents = _mapper.Map<List<ContentResponseDto>>(_userRepository.GetContentsByUser(userId));

            if (!ModelState.IsValid)
                return BadRequest();

            return Ok(contents);
        }

        [HttpPost]
        [ProducesResponseType(200, Type = typeof(UserResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult CreateUser([FromBody] UserPostRequestDto userCreate)
        {
            if (userCreate == null)
                return BadRequest(ModelState);

            var userSame = _userRepository.GetUsers()
                .Where(u => u.Email == userCreate.Email)
                .FirstOrDefault();

            if(userSame != null)
            {
                ModelState.AddModelError("", $"Account with email {userSame.Email} is already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userMap = _mapper.Map<User>(userCreate);

            if(userMap.CreatedAt == DateTime.MinValue)
                userMap.CreatedAt = DateTime.UtcNow;

            if (!_userRepository.CreateUser(userMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(_mapper.Map<UserResponseDto>(userMap));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200, Type = typeof(UserResponseDto))]
        [ProducesResponseType(404)]
        public IActionResult UpdateUser(int id, [FromBody] UserPutRequestDto updatedUser)
        {
            if (updatedUser == null)
                return BadRequest(ModelState);

            if (!_userRepository.UserExists(id))
                return NotFound();

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var userToUpdate = _userRepository.GetUser(id);    
            // make mapping, ignoring nulls on updatedUser
            updatedUser.HashedPassword ??= userToUpdate.HashedPassword;
            var userMap = _mapper.Map(updatedUser, userToUpdate);

            if (!_userRepository.UpdateUser(userMap))
            {
                ModelState.AddModelError("", "Something went wrong while updating");
                return StatusCode(500, ModelState);
            }

            return Ok(_mapper.Map<UserResponseDto>(userMap));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteUser(int id)
        {
            if (!_userRepository.UserExists(id))
                return NotFound();

            var userToDelete = _userRepository.GetUser(id);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_userRepository.DeleteUser(userToDelete))
            {
                ModelState.AddModelError("", "Something went wrong while deleting");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpGet("{userId}/recommendations")]
        [ProducesResponseType(200, Type = typeof(ContentResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetContentsByUserRecommendations(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var users = _userRepository.GetUsers();

            var userRatings = new Dictionary<int, Dictionary<int, int>>();
            var contentsAdded = new List<Content>();

            foreach (var user in users) 
            {
                contentsAdded = _userRepository.GetContentFromUserPlaylists(user.Id).ToList();
                if(contentsAdded.Count != 0)
                    userRatings.Add(user.Id, contentsAdded.ToDictionary(c => c.Id, _ => 1));
            }

            Console.Write(userRatings);

            var contents = _contentRepository.GetContents();

            if (userRatings.Count == 0 || !userRatings.ContainsKey(userId))
                return Ok(_mapper.Map < List < ContentResponseDto >>(contents));

            var filter = ContentCollaborativeFilter.GetRecommendations(userRatings, userId);

            var recommendedContents = _mapper.Map<List<ContentResponseDto>>(contents.Where(c => filter.Contains(c.Id)));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(recommendedContents);
        }

    }
}
