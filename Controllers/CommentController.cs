using AutoMapper;
using FellaudioApp.Dto.Request;
using FellaudioApp.Dto.Response;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.AspNetCore.Mvc;

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

        public CommentController(ICommentRepository commentRepository, IUserRepository userRepository, 
            IMapper mapper, IContentRepository contentRepository)
        {
            _userRepository = userRepository;
            _commentRepository = commentRepository;
            _contentRepository = contentRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CommentResponseDto>))]
        public IActionResult GetComments()
        {
            var comments = _mapper.Map<List<CommentResponseDto>>(_commentRepository.GetComments());

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(comments);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(CommentResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetComment(int id)
        {
            if (!_commentRepository.CommentExists(id))
                return NotFound();

            var comment = _mapper.Map<CommentResponseDto>(_commentRepository.GetComment(id));

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(comment);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateComment([FromBody] CommentPostRequestDto commentCreate)
        {
            if (commentCreate == null)
                return BadRequest(ModelState);

            var userId = commentCreate.UserId;
            var contentId = commentCreate.ContentId;

            if (!_userRepository.UserExists(userId))
                return NotFound();

            if (!_contentRepository.ContentExists(contentId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var commentMap = _mapper.Map<Comment>(commentCreate);

            commentMap.User = _userRepository.GetUser(userId);
            commentMap.Content = _contentRepository.GetContent(contentId);

            if (commentMap.CreatedAt == DateTime.MinValue)
                commentMap.CreatedAt = DateTime.UtcNow;

            if (!_commentRepository.CreateComment(commentMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully created");
        }

        [HttpPut("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateComment(int id, [FromBody] CommentPutRequestDto updatedComment)
        {
            if (updatedComment == null)
                return BadRequest(ModelState);

            if (!_commentRepository.CommentExists(id))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var commentToUpdate = _commentRepository.GetComment(id);
            var commentMap = _mapper.Map(updatedComment, commentToUpdate);

            if (!_commentRepository.UpdateComment(commentMap))
            {
                ModelState.AddModelError("", "Something went wrong while updating");
                return StatusCode(500, ModelState);
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteComment(int id)
        {
            if (!_commentRepository.CommentExists(id))
                return NotFound();

            var commentToDelete = _commentRepository.GetComment(id);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_commentRepository.DeleteComment(commentToDelete))
            {
                ModelState.AddModelError("", "Something went wrong while deleting");
                StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
