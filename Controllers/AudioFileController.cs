using AutoMapper;
using FellaudioApp.Dto;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace FellaudioApp.Controllers
{
    [Route("api/[controller]")]
    [Controller]
    public class AudioFileController : Controller
    {
        private readonly IAudioFileRepository _audioFileRepository;
        private readonly IMapper _mapper;

        public AudioFileController(IAudioFileRepository audioFileRepository, IMapper mapper)
        {
            _audioFileRepository = audioFileRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AudioFileDto>))]
        public IActionResult GetAudioFiles()
        {
            var audiofiles = _mapper.Map<List<AudioFileDto>>(_audioFileRepository.GetAudioFiles());

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(audiofiles);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(AudioFileDto))]
        [ProducesResponseType(400)]
        public IActionResult GetAudioFile(int id)
        {
            if (!_audioFileRepository.AudioFileExists(id))
                return NotFound();
            
            var audiofile = _mapper.Map<AudioFileDto>(_audioFileRepository.GetAudioFile(id));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(audiofile);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateAudioFile([FromBody] AudioFileDto audiofileCreated)
        {
            if (audiofileCreated == null)
                return BadRequest(ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var audiofileMap = _mapper.Map<AudioFile>(audiofileCreated);

            if (!_audioFileRepository.CreateAudioFile(audiofileMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return Ok("Successfully created");
        }
    }
}
