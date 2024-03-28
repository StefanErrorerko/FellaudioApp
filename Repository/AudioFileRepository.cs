using FellaudioApp.Data;
using FellaudioApp.Interfaces;
using FellaudioApp.Models;
using Microsoft.EntityFrameworkCore;

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
            return _context.AudioFiles
                .Where(af => af.Id == id)
                .Include(a => a.Content)
                .FirstOrDefault();
        }
        public ICollection<AudioFile> GetAudioFiles()
        {
            return _context.AudioFiles
                .Include(a => a.Content)
                .OrderBy(af => af.Id)
                .ToList();
        }
        public bool UpdateAudioFile(AudioFile audioFile)
        {
            var existingAudioFile = _context.AudioFiles.Local.FirstOrDefault(af => af.Id == audioFile.Id)
                ?? _context.AudioFiles.FirstOrDefault(af => af.Id == audioFile.Id);
            // костиль
            _context.Entry(existingAudioFile).State = EntityState.Detached;
            var s = _context.ChangeTracker.Entries().Select(e => e.Entity).ToList();

            _context.Update(audioFile);
            return Save();
        }
        public bool DeleteAudioFile(AudioFile audioFile)
        {
            _context.Remove(audioFile);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

    }
}
