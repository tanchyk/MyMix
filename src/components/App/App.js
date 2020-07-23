import React from 'react';
import './App.css';
import AppCreate from '../AppCreate/AppCreate';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import AppChange from '../AppChange/AppChange';

const App = () => {
    return (
      <div>
        <Router>
          <Link to="/" style={{textDecoration: 'none'}}>
            <h1>my<span className="highlight">mix</span></h1>
          </Link>

          <div style={{minHeight: '90vh'}}>
            <div id="head" className="navigation " style={{height: '65vh', backgroundColor: '#24AFBA'}}>
              <h1 className="header">Create a brand new playlist, or made yours better.</h1>
            </div>

            <div className="navigation">
              <nav className="navigation-inline">
                <Link to="/create" style={{textDecoration: 'none'}}>
                  <li className="left">CREATE NEW</li>
                </Link>
                <Link to="/change" style={{textDecoration: 'none'}}>
                  <li className="right">CHANGE YOURS</li>
                </Link>
              </nav>
            </div>
          </div>

          <Route path="/create">
            {/* {Spotify.getAccessToken()} */}
            <AppCreate />
          </Route>

          <Route path="/change">
            <AppChange />
          </Route>

        </Router>
      </div>
    );
}

export default App;
