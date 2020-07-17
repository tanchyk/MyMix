const clientId = '22d1218ef6db4311ab97e536e8718ac0';
const redirectUri = 'http://localhost:3000/';
let userToken = '';

const Spotify = {
    getAccessToken: function() {
        if(userToken) {
            return userToken;
        }

        // Check for access token to match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
            userToken = accessTokenMatch;
            const expiresIn = Number(expiresInMatch[1]);

            // Clears the parameters and allows to grab new token after it epires
            window.setTimeout(() => userToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return userToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search: async function(term) {
        const accessToken = Spotify.getAccessToken();
        return await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bareer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.track) {
                return [];
            } else {
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artist[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            }
        })
    }
};

export default Spotify;