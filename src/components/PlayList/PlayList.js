import React from 'react';
import './PlayList.css';
import {TrackList} from '../TrackList/TrackList';

export class PlayList extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event){
        this.props.onNameChange(event.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                <input defaultValue="New Playlist" onChange={this.handleNameChange}/>
                <TrackList tracks={this.props.playListTracks} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={true} />
                <button className="Playlist-save">SAVE TO SPOTIFY</button>
            </div>
        );
    }
}