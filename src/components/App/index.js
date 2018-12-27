import React, { Component } from 'react';
import './index.css';
import SceneView from '../SceneView';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="com-logo-div">
          <a href="https://data.melbourne.vic.gov.au/Property-Planning/City-of-Melbourne-3D-Point-Cloud-2018/2dqj-9ydd"
           target="_blank"><img src="img/com-logo.png"
            alt="City of Melbourne logo"
            className="com-logo"
          ></img>
          </a>
        </div>
        <SceneView />
      </div>
    );
  }
}

export default App;
