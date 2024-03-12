using AutoMapper;
using FellaudioApp.Data;
using FellaudioApp.Dto;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace FellaudioApp.Controllers
{
    [Route("api/[controller]")]
    [Controller]
    public class PointController : Controller
    {
        private readonly IPointRepository _pointRepository;
        private readonly IContentRepository _contentRepository;
        private readonly IMapper _mapper;
        public PointController(IMapper mapper, IPointRepository pointRepository, IContentRepository contentRepository)
        {
            _mapper = mapper;
            _pointRepository = pointRepository;
            _contentRepository = contentRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<PointDto>))]
        public IActionResult GetPoints()
        {
            var points = _mapper.Map<List<PointDto>>(_pointRepository.GetPoints());
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            return Ok(points);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(PointDto))]
        [ProducesResponseType(400)]
        public IActionResult GetPoint(int id)
        {
            if (!_pointRepository.PointExists(id))
                return NotFound();

            var point = _mapper.Map<PointDto>(_pointRepository.GetPoint(id));

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(point);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePoint([FromQuery] int contentId, [FromBody] PointDto pointCreate)
        {
            if (pointCreate == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var pointMap = _mapper.Map<Point>(pointCreate);
            pointMap.Content = _contentRepository.GetContent(contentId);

            if (!_pointRepository.CreatePoint(pointMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully created");
        }
    }
}
