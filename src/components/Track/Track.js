import React from 'react';
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.playPreview = this.playPreview.bind(this);
    }

    renderAction(){
        if(!this.props.isRemoval) {
            return <a className="Track-action" onClick={this.removeTrack}>-</a>
        } else {
            return <a className="Track-action" onClick={this.addTrack}>+</a>
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);

        //Removes Track From Search
        this.props.onSearchRemove(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);

        this.props.onSearchAdd(this.props.track);
    }

    playPreview() {
        window.open(this.props.preview);
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                <a onClick={this.playPreview} traget="_blank" class="play-button">
                    <img width="18px" height="18px" src="https://mobiriz.com/colorm/assets/images/play-button.svg" />
                </a>
                {this.renderAction()}
            </div>
        );
    }
}