using FellaudioApp.Models;

namespace FellaudioApp.Interfaces
{
    public interface IAudioFileRepository
    {
        ICollection<AudioFile> GetAudioFiles();
        AudioFile GetAudioFile(int id);
        bool AudioFileExists(int id);
        bool CreateAudioFile(AudioFile audioFile);
        bool Save();
    }
}
