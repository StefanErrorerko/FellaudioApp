using AutoMapper;
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

        public CommentController(ICommentRepository commentRepository, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _commentRepository = commentRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Comment>))]
        public IActionResult GetComments()
        {
            var comments = _commentRepository.GetComments();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(comments);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Comment))]
        [ProducesResponseType(400)]
        public IActionResult GetComment(int id)
        {
            if (!_commentRepository.CommentExists(id))
                return NotFound();

            var comment = _commentRepository.GetComment(id);

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(comment);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateComment([FromQuery] int userId, [FromBody] Comment commentCreate)
        {
            if (commentCreate == null)
                return BadRequest(ModelState);

            commentCreate.Author = _userRepository.GetUser(userId);

            if (!_commentRepository.CreateComment(commentCreate))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully created");
        }
    }
}
