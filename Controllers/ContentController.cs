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
        private readonly IMapper _mapper;   

        public ContentController(IContentRepository contentRepository, IMapper mapper)
        {
            _contentRepository = contentRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Content>))]
        public IActionResult GetContents()
        {
            var contents = _mapper.Map<List<ContentDto>>(_contentRepository.GetContents());
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(contents);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Content))]
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
        public IActionResult CreateContent([FromBody] ContentDto contentCreate)
        {
            if(contentCreate == null)
                return BadRequest(ModelState);

            var content = _contentRepository.GetContents()
                .Where(c => c.Title.Trim().ToUpper() == contentCreate.Title.TrimEnd().ToUpper())
                .FirstOrDefault();

            if(content != null)
            {
                ModelState.AddModelError("", "Content is already exists");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var contentMap = _mapper.Map<Content>(contentCreate);

            if (!_contentRepository.CreateContent(contentMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Succesfully created");
        }
    }
}
