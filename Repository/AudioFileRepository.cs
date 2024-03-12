using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;

namespace FellaudioApp.Repository
{
    public class AudioFileRepository : IAudioFileRepository
    {
        private readonly DataContext _context;
        public AudioFileRepository(DataContext context)
        {
            _context = context;
        }

        public bool AudioFileExists(int id)
        {
            return _context.AudioFiles.Any(af => af.Id == id);
        }

        public bool CreateAudioFile(AudioFile audioFile)
        {
            _context.Add(audioFile);
            return Save();
        }

        public AudioFile GetAudioFile(int id)
        {
            return _context.AudioFiles.Where(af => af.Id == id).FirstOrDefault();
        }

        public ICollection<AudioFile> GetAudioFiles()
        {
            return _context.AudioFiles.OrderBy(af => af.Id).ToList();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
