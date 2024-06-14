using AutoMapper;
using FellaudioApp.Dto;
using FellaudioApp.Dto.Request;
using FellaudioApp.Dto.Response;
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
        private readonly IMapper _mapper;   

        public ContentController(IContentRepository contentRepository, IMapper mapper, 
            IUserRepository userRepository)
        {
            _contentRepository = contentRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ContentResponseDto>))]
        public IActionResult GetContents()
        {
            var contents = _mapper.Map<List<ContentResponseDto>>(_contentRepository.GetContents());

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(contents);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(ContentResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetContent(int id)
        {
            if (!_contentRepository.ContentExists(id))
                return NotFound();
            
            var content = _mapper.Map<ContentResponseDto>(_contentRepository.GetContent(id));

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(content);
        }

        [HttpGet("{id}/audiofile")]
        [ProducesResponseType(200, Type = typeof(AudioFile))]
        [ProducesResponseType(400)]
        public IActionResult GetAudioFileByContent(int id)
        {
            if(!_contentRepository.ContentExists(id))
                return NotFound();

            var audioFile = _mapper.Map<AudioFile>(_contentRepository.GetAudioFileByContent(id));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(audioFile);
        }
        
        [HttpGet("{id}/points")]
        [ProducesResponseType(200, Type = typeof(PointResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetPointsByContent(int id)
        {
            if (!_contentRepository.ContentExists(id))
                return NotFound();

            var points = _mapper.Map<List<PointResponseDto>>(_contentRepository.GetPointsByContent(id));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(points);
        }

        [HttpGet("{contentId}/comments")]
        [ProducesResponseType(200, Type = typeof(CommentResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetCommentsByContent(int contentId)
        {
            if (!_contentRepository.ContentExists(contentId))
                return NotFound();

            var comments = _mapper.Map<List<CommentResponseDto>>(_contentRepository.GetCommentsByContent(contentId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(comments);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateContent([FromBody] ContentPostRequestDto contentCreate)
        {
            if(contentCreate == null)
                return BadRequest(ModelState);

            var userId = contentCreate.UserId;

            if (!_userRepository.UserExists(userId))
                return NotFound();

            var user = _userRepository.GetUser(userId);

            var contentSame = _contentRepository.GetContents()
                .Where(c => c.Title.Trim().ToUpper() == contentCreate.Title.TrimEnd().ToUpper() 
                    && c.User == user)
                .FirstOrDefault();

            if(contentSame != null)
            {
                ModelState.AddModelError("", $"Content title '{contentSame.Title}' is already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var contentMap = _mapper.Map<Content>(contentCreate);
            contentMap.User = user;

            if (contentMap.CreatedAt == DateTime.MinValue)
                contentMap.CreatedAt = DateTime.UtcNow;

            if (!_contentRepository.CreateContent(contentMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(_mapper.Map<ContentResponseDto>(contentMap));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateContent(int id, [FromBody] ContentPutRequestDto updatedContent)
        {
            if(updatedContent == null)
                return BadRequest(ModelState);

            if (!_contentRepository.ContentExists(id))
                return NotFound();

            var contentToUpdate = _contentRepository.GetContent(id);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var contentMap = _mapper.Map(updatedContent, contentToUpdate);

            if (!_contentRepository.UpdateContent(contentMap))
            {
                ModelState.AddModelError("", "Something wentwrong while saving");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteContent(int id)
        {
            if (!_contentRepository.ContentExists(id))
                return NotFound();

            var contentToDelete = _contentRepository.GetContent(id);

            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            if (!_contentRepository.DeleteContent(contentToDelete))
            {
                ModelState.AddModelError("", "Something went wrong while deleting");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
