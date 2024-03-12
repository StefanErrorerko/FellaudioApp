using AutoMapper;
using FellaudioApp.Dto;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace FellaudioApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContentController : Controller
    {
        private readonly IContentRepository _contentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAudioFileRepository _audioFileRepository;
        private readonly IMapper _mapper;   

        public ContentController(IContentRepository contentRepository, IMapper mapper, 
            IUserRepository userRepository, IAudioFileRepository audioFileRepository)
        {
            _contentRepository = contentRepository;
            _userRepository = userRepository;
            _audioFileRepository = audioFileRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ContentDto>))]
        public IActionResult GetContents()
        {
            var contents = _mapper.Map<List<ContentDto>>(_contentRepository.GetContents());
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(contents);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(ContentDto))]
        [ProducesResponseType(400)]
        public IActionResult GetContent(int id)
        {
            if (!_contentRepository.ContentExists(id))
                return NotFound();
            
            var content = _contentRepository.GetContent(id);

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(content);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateContent([FromQuery] int audiofileId, [FromQuery] int userId, [FromBody] ContentDto contentCreate)
        {
            if(contentCreate == null)
                return BadRequest(ModelState);

            var user = _userRepository.GetUser(userId);

            var content = _contentRepository.GetContents()
                .Where(c => c.Title.Trim().ToUpper() == contentCreate.Title.TrimEnd().ToUpper() 
                    && c.User == user)
                .FirstOrDefault();

            if(content != null)
            {
                ModelState.AddModelError("", $"Content title '{content.Title}' is already exists");
                return StatusCode(422, ModelState);
            }

            content = _contentRepository.GetContents()
                .Where(c => c.AudioFileId == audiofileId)
                .FirstOrDefault();

            if(content != null)
            {
                ModelState.AddModelError("", "Content contains that audiofile is already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var contentMap = _mapper.Map<Content>(contentCreate);

            contentMap.User = user;
            contentMap.AudioFile = _audioFileRepository.GetAudioFile(audiofileId);

            if (contentMap.CreatedAt == DateTime.MinValue)
                contentMap.CreatedAt = DateTime.UtcNow;

            if (!_contentRepository.CreateContent(contentMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Succesfully created");
        }
    }
}
