import React from 'react';
import './App.css';
import AppCreate from '../AppCreate/AppCreate';
import Spotify from '../../util/Spotify';

Spotify.getAccessToken();

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>my<span className="highlight">mix</span></h1>
        <div style={{minHeight: '100vh'}}>
          <div id="head" className="navigation " style={{height: '65vh', backgroundColor: '#24AFBA'}}>
            <h1 className="header">Create a brand new playlist, or made yours better.</h1>
          </div>

          <div className="navigation">
            <nav className="navigation-inline">
              <a className="left">CREATE NEW</a>
              <a className="right">CHANGE YOURS</a>
            </nav>
          </div>
        </div>

        <AppCreate />
      </div>
    );
  }
}

export default App;
