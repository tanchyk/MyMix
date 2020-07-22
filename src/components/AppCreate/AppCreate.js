import React from 'react';
import './AppCreate.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import {PlayList} from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

class AppCreate extends React.Component {
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

    this.search = this.search.bind(this);
    this.removeSearchResults = this.removeSearchResults.bind(this);
    this.addSearchResults = this.addSearchResults.bind(this);
  }

  componentWillMount() {
    Spotify.getAccessToken();
  }

  // Tracks

  addTrack(track) {
    //Check if track already in playlsist
    const trackUris = this.state.playListTracks.map(trackU => trackU.uri);
    if(trackUris.includes(track.uri)) {
      return;
    } else {
      let tracks = this.state.playListTracks;
      tracks.push(track);
      this.setState({ playlistTracks: tracks });
    }
  }

  removeTrack(track) {
    let tracks = this.state.playListTracks;
    tracks = tracks.filter(trackNew => trackNew.id !== track.id);

    this.setState({playListTracks: tracks});
  }

  // Playlist

  updatePlayListName(name) {
    this.setState({playListName: name});
  }

  savePlayList() {
    const trackURIs = this.state.playListTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playListName, trackURIs).then(() => {
      this.setState({
        playListTracks: []
      });
    });
  }

  // Search

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

  // Render

  render() {
    return (
        <div className="App">
          <h4>Search songs</h4>
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} onSearchRemove={this.removeSearchResults}/>
            <PlayList 
              playListName={this.state.playListName} 
              playListTracks={this.state.playListTracks} 
              onNameChange={this.updatePlayListName} 
              onRemove={this.removeTrack}
              onSave={this.savePlayList}
              onSearchAdd={this.addSearchResults}
            />
          </div>
        </div>
    );
  }
}

export default AppCreate;