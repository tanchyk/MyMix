import { PlayList } from "../components/PlayList/PlayList";

const clientId = '22d1218ef6db4311ab97e536e8718ac0';
let redirectUri = '';

let accessToken;
let id = '';

const Spotify = {
    // Gets access token from Spotify
    getAccessToken(check) {
        if(check === 'create') {
            redirectUri = 'http://localhost:3000/create'
        } else {
            redirectUri = 'http://localhost:3000/change'
        }

        if(accessToken) {
            return accessToken;
        }
        const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (hasAccessToken && hasExpiresIn) {
            accessToken = hasAccessToken[1];
            const expiresIn = Number(hasExpiresIn[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    // Uses access token to return a response from the Spoitify API using user serach term from SearchBar
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(
            response => { 
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('API request failed');
                }
        }).then(
            jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                cover: track.album.images[2].url,
                preview: track.preview_url
            }));
        });
    },

    async findPlaylist(term) {
        if(!term){
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        let response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: headers
        });

        let data = await response.json();

        for(let playlist of data.items) {
            if(term == playlist.name) {
                return playlist.id;
            }
        }
    },

    async changePlaylist(term) {
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        id = await this.findPlaylist(term);


        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
            headers: headers
        });

        const data = await response.json();

        if(!data.items) {
            return;
        }

        return data.items.map(item => {
            return{
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                uri: item.track.uri,
                cover: item.track.album.images[2].url,
                preview: item.track.preview_url
            }
        });
    },

    async addToPlaylist(track) {
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        console.log(track.uri)

        return fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({uris: [`${track.uri}`]})
        });
    },

    async removeFromPlaylist(track) {
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        return fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({tracks: [{uri: track.uri }]})
        });
    },

    // Gets a user's ID from Spotify, creates a new playlist on user's account, and adds tracks to that playlist
    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;

        // Return user's ID from Spotify API
        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(
            response => {
                if(response.ok) {
                    return response.json();
                } 
        }).then(
            jsonResponse => {
                userId = jsonResponse.id;

                // Adds playlist to user's account
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                }).then(
                    response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log('API request failed');
                    }
                }).then(
                    jsonResponse => {
                        const playlistId = jsonResponse.id;

                        // Adds tracks to new playlist 
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackURIs})
                        });
                    });
            });
    }
}

export default Spotify;