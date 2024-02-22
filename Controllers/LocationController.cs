using AutoMapper;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace FellaudioApp.Controllers
{
    [Route("api/[controller]")]
    [Controller]
    public class LocationController : Controller
    {
        private ILocationRepository _locationRepository;
        private IMapper _mapper;
        public LocationController(ILocationRepository locationRepository, IMapper mapper)
        {
            _locationRepository = locationRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Location>))]
        public IActionResult GetLocations()
        {
            var locations = _locationRepository.GetLocations();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(locations);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Location))]
        [ProducesResponseType(400)]
        public IActionResult GetLocation(int id) 
        {
            if (!_locationRepository.LocationExists(id))
                return NotFound();

            var location = _locationRepository.GetLocation(id);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(location);
        }
    }
}
