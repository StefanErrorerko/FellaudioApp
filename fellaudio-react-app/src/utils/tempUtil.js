const contentImages = require.context('../assets/contentImages', false, /\.(jpg|jpeg|png|webp)$/);
const contentAudios = require.context('../assets/contentAudios', false, /\.(mp3|wav)$/);
const profileImages = require.context('../assets/profileImages', false, /\.(jpg|jpeg|png|webp)$/);

function getImageById(id, imageArray) {
  try {
    return imageArray(`./${id}.jpg`);
  } catch (err) {
    console.error(`Image for id ${id} not found`);
    return null;
  }
}

function getAudioFileById(id, audioArray) {
    try {
      return audioArray(`./${id}.mp3`);
    } catch (err) {
      console.error(`AudioFile for id ${id} not found`);
      return null;
    }
  }

export function FillContentWithImages(contents) {
    contents.forEach(content => {
        const image = getImageById(content.id, contentImages);
        if (image) {
          content.image = image;
        }
      });
    
      return contents;
}

export function FillProfileWithImages(profiles) {
    profiles.forEach(profile => {
        const image = getImageById(profile.id, profileImages);
        if (image) {
            profile.image = image;
        }
      });
    
      return profiles;
}

export async function GetAudioFiles(contents) {
    let audiofiles = []
    await Promise.all(contents.map(async content => {
        const audioPath = getAudioFileById(content.id, contentAudios);

        if (audioPath) {
            try {
                const response = await fetch(audioPath);
                const blob = await response.blob();
                const audioObject = new Audio();
                audioObject.src = URL.createObjectURL(blob);

                audioObject.onloadedmetadata = () => {
                    const audioFile = {
                        data: audioPath,
                        fileDuration: audioObject.duration
                    };
                    audiofiles.push({ [content.id]: audioFile });
                    
                };
            } catch (error) {
                console.error(`Error loading audio for content ${content.id}:`, error);
            }
        }
    }));

    return audiofiles;
}

export function FillContentWithMedia(contents) {
    return Promise.all(contents.map(async content => {
        const audioPath = getAudioFileById(content.id, contentAudios);
        const imagePath = getImageById(content.id, contentImages);

        if (audioPath) {
            try {
                const response = await fetch(audioPath);
                const blob = await response.blob();
                const audioObject = new Audio();
                audioObject.src = URL.createObjectURL(blob);

                await new Promise(resolve => {
                    audioObject.onloadedmetadata = () => {
                        const audioFile = {
                            data: audioPath,
                            durationInSeconds: audioObject.duration
                        };
                        content.audioFile = audioFile;
                        resolve();
                    };
                });
            } catch (error) {
                console.error(`Error loading audio for content ${content.id}:`, error);
            }
        }
        else{
            const audioFile = {
                data: audioPath
            };
            content.audioFile = audioFile;
        }

        if (imagePath) {
            content.image = imagePath;
        }

        return content;
    }));
}