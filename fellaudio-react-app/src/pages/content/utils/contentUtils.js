const ApiUrl = process.env.REACT_APP_API_URL;

export const sortComments = (comments) => {
    const sortedComments = comments?.slice().sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateA - dateB;
    });
    return sortedComments;
}

export const sortPoints = (points) => {
    points.sort((a, b) => {
        if (a.previouspointid === 0) return -1; 
        if (b.previouspointid === 0) return 1; 
        return a.previouspointid - b.previouspointid;
      });

    return points
}

export async function likeContent(user, content) {
    console.log("check", user, content);

    const playlistResponse = await fetch(`${ApiUrl}/User/${user.id}/playlist/saved`);
    let playlistSaved = await playlistResponse.json();

    if(playlistSaved === null){
        const playlistCreateResponse = await fetch(`${ApiUrl}/Playlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: 'Ваш плейлист вподобаного',
                type: 'Saved',
                userId: user.id
            })
        });
        playlistSaved = await playlistCreateResponse.json();
    }

    const response = await fetch(`${ApiUrl}/Playlist/add/content`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playlistId: playlistSaved.id,
            contentId: content.id,
        }),
    });

    if (response.status !== 204) {
        throw new Error('Failed to update playlist');
    }
}

export async function dislikeContent(user, content) {
    try {
        const playlistResponse = await fetch(`${ApiUrl}/User/${user.id}/playlist/saved`);
        const playlistSaved = await playlistResponse.json();

        const response = await fetch(`${ApiUrl}/Playlist/${playlistSaved.id}/content/${content.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 204) {
            throw new Error('Failed to delete content from playlist');
        }
        console.log('Content successfully deleted from playlist');
    } catch (err) {
        throw err;
    }
}
