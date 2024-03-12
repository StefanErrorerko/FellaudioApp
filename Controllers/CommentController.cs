using AutoMapper;
using FellaudioApp.Dto;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace FellaudioApp.Controllers
{
    [Route("api/[controller]")]
    [Controller]
    public class CommentController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly ICommentRepository _commentRepository;
        private readonly IContentRepository _contentRepository;
        private readonly IMapper _mapper;

        public CommentController(ICommentRepository commentRepository, IUserRepository userRepository, IMapper mapper, IContentRepository contentRepository)
        {
            _userRepository = userRepository;
            _commentRepository = commentRepository;
            _mapper = mapper;
            _contentRepository = contentRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CommentDto>))]
        public IActionResult GetComments()
        {
            var comments = _mapper.Map<List<CommentDto>>(_commentRepository.GetComments());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(comments);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(CommentDto))]
        [ProducesResponseType(400)]
        public IActionResult GetComment(int id)
        {
            if (!_commentRepository.CommentExists(id))
                return NotFound();

            var comment = _mapper.Map<CommentDto>(_commentRepository.GetComment(id));

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(comment);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateComment([FromQuery] int userId, [FromQuery] int contentId, [FromBody] CommentDto commentCreate)
        {
            if (commentCreate == null)
                return BadRequest(ModelState);

            var commentMap = _mapper.Map<Comment>(commentCreate);

            commentMap.User = _userRepository.GetUser(userId);
            commentMap.Content = _contentRepository.GetContent(contentId);

            // If createdAt filed was not defined
            if (commentMap.CreatedAt == DateTime.MinValue)
                commentMap.CreatedAt = DateTime.UtcNow;

            if (!_commentRepository.CreateComment(commentMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully created");
        }
    }
}
