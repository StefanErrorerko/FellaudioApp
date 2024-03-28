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
    public class AudioFileController : Controller
    {
        private readonly IAudioFileRepository _audioFileRepository;
        private readonly IContentRepository _contentRepository;
        private readonly IMapper _mapper;

        public AudioFileController(IAudioFileRepository audioFileRepository, IContentRepository contentRepository, IMapper mapper)
        {
            _audioFileRepository = audioFileRepository;
            _contentRepository = contentRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AudioFileResponseDto>))]
        public IActionResult GetAudioFiles()
        {
            var audiofiles = _mapper.Map<List<AudioFileResponseDto>>(_audioFileRepository.GetAudioFiles());

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(audiofiles);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(AudioFileResponseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetAudioFile(int id)
        {
            if (!_audioFileRepository.AudioFileExists(id))
                return NotFound();
            
            var audiofile = _mapper.Map<AudioFileResponseDto>(_audioFileRepository.GetAudioFile(id));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(audiofile);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateAudioFile([FromBody] AudioFilePostRequestDto audiofileCreated)
        {
            if (audiofileCreated == null)
                return BadRequest(ModelState);

            var contentId = audiofileCreated.ContentId;

            if (!_contentRepository.ContentExists(contentId))
                return NotFound();

            var content = _audioFileRepository.GetAudioFiles()
                .Where(a => a.ContentId == contentId)
                .FirstOrDefault();

            if(content != null)
            {
                ModelState.AddModelError("", "AudioFile must be connected only to one Content");
                return StatusCode(500, ModelState);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var audiofileMap = _mapper.Map<AudioFile>(audiofileCreated);
            audiofileMap.Content = _contentRepository.GetContent(contentId);

            if (!_audioFileRepository.CreateAudioFile(audiofileMap))
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
        public IActionResult UpdateAudioFile(int id, [FromBody] AudioFilePutRequestDto updatedAudiofile)
        {
            if (updatedAudiofile == null)
                return BadRequest(ModelState);

            if (!_audioFileRepository.AudioFileExists(id))
                return NotFound();

            

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var audiofileToUpdate = _audioFileRepository.GetAudioFile(id);
            var audiofileMap = _mapper.Map(updatedAudiofile, audiofileToUpdate);

            if (updatedAudiofile.ContentId != null)
            {
                var contentId = updatedAudiofile.ContentId ?? -1;

                if (!_contentRepository.ContentExists(contentId))
                    return NotFound();

                var content = _audioFileRepository.GetAudioFiles()
                .Where(a => a.ContentId == contentId && a.Id != id)
                .FirstOrDefault();

                if (content != null)
                {
                    ModelState.AddModelError("", "AudioFile must be connected only to one Content");
                    return StatusCode(500, ModelState);
                }
                // чи треба давати можливість?
                audiofileMap.Content = _contentRepository.GetContent(contentId);
            }

            if (!_audioFileRepository.UpdateAudioFile(audiofileMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteAudioFile(int id)
        {
            if (!_audioFileRepository.AudioFileExists(id))
                return NotFound();

            var audiofileToDelete = _audioFileRepository.GetAudioFile(id);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_audioFileRepository.DeleteAudioFile(audiofileToDelete))
            {
                ModelState.AddModelError("", "Something went wrong while deleting");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }
    }
}
