import React, { Component } from 'react';
import './index.css';
import SceneView from '../SceneView';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="com-logo-div">
          <img src="img/com-logo.png"
            alt="City of Melbourne logo"
            className="com-logo"
          ></img>
        </div>
        <SceneView />
      </div>
    );
  }
}

export default App;
