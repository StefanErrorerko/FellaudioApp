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
    [Controller]
    public class LocationController : Controller
    {
        private readonly ILocationRepository _locationRepository;
        private readonly IMapper _mapper;
        public LocationController(ILocationRepository locationRepository, IMapper mapper)
        {
            _locationRepository = locationRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<LocationResponseDto>))]
        public IActionResult GetLocations()
        {
            var locations = _locationRepository.GetLocations();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(locations);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(LocationResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetLocation(int id) 
        {
            if (!_locationRepository.LocationExists(id))
                return NotFound();

            var location = _mapper.Map<LocationResponseDto>(_locationRepository.GetLocation(id));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(location);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateLocation([FromBody] LocationPostRequestDto locationCreate)
        {
            if (locationCreate == null)
                return BadRequest(ModelState);

            /*var location = _locationRepository.GetLocations()
                .Where(l => l.Latitude == locationCreate.Latitude && l.Longitude == locationCreate.Longitude)
                .FirstOrDefault();

            if(location != null)
            {
                ModelState.AddModelError("", "Location is already exists");
                return StatusCode(422, ModelState);
            }*/

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var locationMap = _mapper.Map<Location>(locationCreate);

            if (!_locationRepository.CreateLocation(locationMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok(_mapper.Map<LocationResponseDto>(locationMap));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateLocation(int id, [FromBody] LocationPutRequestDto updatedLocation)
        {
            if (updatedLocation == null)
                return BadRequest(ModelState);

            if (!_locationRepository.LocationExists(id))
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var locationToUpdate = _locationRepository.GetLocation(id);
            var locationMap = _mapper.Map(updatedLocation, locationToUpdate);

            if (!_locationRepository.UpdateLocation(locationMap))
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
        public IActionResult DeleteLocation(int id)
        {
            if (!_locationRepository.LocationExists(id))
                return NotFound();

            var locationToDelete = _locationRepository.GetLocation(id);

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_locationRepository.DeleteLocation(locationToDelete))
            {
                ModelState.AddModelError("", "Something went wrong while deleting");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
