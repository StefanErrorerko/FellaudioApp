using AutoMapper;
using FellaudioApp.Data;
using FellaudioApp.Dto;
using FellaudioApp.Dto.Request;
using FellaudioApp.Dto.Response;
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
        private readonly ILocationRepository _locationRepository;
        private readonly IMapper _mapper;
        public PointController(IMapper mapper, IPointRepository pointRepository, 
            IContentRepository contentRepository, ILocationRepository locationRepository)
        {
            _mapper = mapper;
            _pointRepository = pointRepository;
            _contentRepository = contentRepository;
            _locationRepository = locationRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<PointResponseDto>))]
        public IActionResult GetPoints()
        {
            var points = _mapper.Map<List<PointResponseDto>>(_pointRepository.GetPoints());
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            return Ok(points);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(PointResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetPoint(int id)
        {
            if (!_pointRepository.PointExists(id))
                return NotFound();

            var point = _mapper.Map<PointResponseDto>(_pointRepository.GetPoint(id));

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(point);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePoint([FromBody] PointPostRequestDto pointCreate)
        {
            if (pointCreate == null)
                return BadRequest(ModelState);

            var locationId = pointCreate.LocationId;
            // костиль ?
            var previousPointId = pointCreate.PreviousPointId ?? -1;
            var contentId = pointCreate.ContentId;

            if (!_contentRepository.ContentExists(contentId))
                return NotFound();

            if (!_locationRepository.LocationExists(locationId))
                return NotFound();
            
            if (pointCreate.PreviousPointId != null && !_pointRepository.PointExists(previousPointId))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var pointMap = _mapper.Map<Point>(pointCreate);
            pointMap.Content = _contentRepository.GetContent(contentId);
            pointMap.Location = _locationRepository.GetLocation(locationId);
            pointMap.PreviousPoint = _pointRepository.GetPoint(previousPointId);

            if (!_pointRepository.CreatePoint(pointMap))
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
        public IActionResult UpdatePoint(int id, [FromBody] PointPutRequestDto updatedPoint)
        {
            if (updatedPoint == null)
                return BadRequest(ModelState);

            if (!_pointRepository.PointExists(id))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var pointToUpdate = _pointRepository.GetPoint(id);
            var pointMap = _mapper.Map(updatedPoint, pointToUpdate);

            if (updatedPoint.LocationId != null)
            {
                var locationId = updatedPoint.LocationId ?? -1;

                if (!_locationRepository.LocationExists(locationId))
                    return NotFound();

                pointMap.Location = _locationRepository.GetLocation(locationId);
            }

            if (updatedPoint.PreviousPointId != null)
            {
                // костиль?
                var previousPointId = updatedPoint.PreviousPointId ?? -1;

                if (!_pointRepository.PointExists(previousPointId))
                    return NotFound();

                pointMap.PreviousPoint = _pointRepository.GetPoint(previousPointId);
            }

            if (!_pointRepository.UpdatePoint(pointMap))
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
        public IActionResult DeletePoint(int id)
        {
            if (!_pointRepository.PointExists(id))
                return NotFound();

            var pointToDelete = _pointRepository.GetPoint(id);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_pointRepository.DeletePoint(pointToDelete))
            {
                ModelState.AddModelError("", "Something went wrong while deleting");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
