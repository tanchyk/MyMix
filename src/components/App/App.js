import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import {PlayList} from '../PlayList/PlayList';
import { TrackList } from '../TrackList/TrackList';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [{name: 'name1', artist: 'artist1', album: 'album1', id: 1}, {name: 'name2', artist: 'artist2', album: 'album2', id: 2}, {name: 'name3', artist: 'artist3', album: 'album3', id: 3}], 
      playListName: '',
      playListTracks: [{name: 'name1', artist: 'artist1', album: 'album1', id: 1}, {name: 'name3', artist: 'artist3', album: 'album3', id: 3}]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playListTracks;
    tracks.map(trackNew => {
      if(trackNew.id === track.id) {
        return;
      }
    });

    tracks.push(track);
    this.setState({playListTracks: tracks});
  }

  removeTrack(track) {
    let tracks = this.state.playListTracks;
    tracks = tracks.filter(trackNew => trackNew.id !== track.id);

    this.setState({playListTracks: tracks});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} onRemove={this.removeTrack} />
            <PlayList playListName={this.state.playListName} playListTracks={this.state.playListTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
