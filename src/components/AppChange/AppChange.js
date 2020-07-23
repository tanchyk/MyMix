import React from 'react';
import Spotify from '../../util/Spotify';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import {PlayList} from '../PlayList/PlayList';


class AppChange extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          searchResults: [], 
          playListName: 'My Playlist',
          playListTracks: []
        };
    
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    
        this.updatePlayListName = this.updatePlayListName.bind(this);
        this.savePlayList = this.savePlayList.bind(this);

        this.findList = this.findList.bind(this);
    
        this.search = this.search.bind(this);
        this.removeSearchResults = this.removeSearchResults.bind(this);
        this.addSearchResults = this.addSearchResults.bind(this);
      }
    
      componentWillMount() {
        Spotify.getAccessToken('change');
      }

      addTrack(track) {
        //Check if track already in playlsist
        const trackUris = this.state.playListTracks.map(trackU => trackU.uri);
        if(trackUris.includes(track.uri)) {
          return;
        } else {
          let tracks = this.state.playListTracks;
          tracks.push(track);

            // Отправка запроса в спотифай

          this.setState({ playlistTracks: tracks });
        }
      }
    
      removeTrack(track) {
        // отправка запроса в спотифай

        let tracks = this.state.playListTracks;
        tracks = tracks.filter(trackNew => trackNew.id !== track.id);
    
        this.setState({playListTracks: tracks});
      }
    
      // Playlist
    
      updatePlayListName(name) {
        this.setState({playListName: name});
      }
    
      // Search

      async findList() {
        await Spotify.changePlaylist(this.state.playListName).then(array => {
            this.setState({
                playListTracks: array
            });
        });
      }
    
      search(term) {
        Spotify.search(term).then(searchResults => {
          this.setState({searchResults: searchResults});
        });
      }
    
      addSearchResults(track) {
        let tracks = this.state.searchResults;
        tracks.unshift(track);
        console.log(track.id);
    
        this.setState({searchResults: tracks});
      }
    
      removeSearchResults(track) {
        let tracks = this.state.searchResults;
        tracks = tracks.filter(trackNew => trackNew.id !== track.id);
    
        this.setState({searchResults: tracks});
      }

    render() {
        return (
            <div className="App">
            <h4>Search songs</h4>
            <SearchBar onSearch={this.search} placeholder={'Enter A Song, Album, or Artist'} />
        
            <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} onSearchRemove={this.removeSearchResults}/>
            <PlayList 
                playListName={this.state.playListName} 
                playListTracks={this.state.playListTracks} 
                onNameChange={this.updatePlayListName}
                onRemove={this.removeTrack}
                onSave={this.findList}
                onSearchAdd={this.addSearchResults}
                button={'LOAD THE PLAYLIST'}
            />
            </div>
        </div>
        );
    }
}

export default AppChange;
