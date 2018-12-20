import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './index.css';

import Slider from '../Slider';

class SceneView extends Component {

  state = {
    view: null,
    layers: []
  }

  async componentDidMount() {
    const [SceneView, WebScene] = await esriLoader.loadModules([
      "esri/views/SceneView",
      "esri/WebScene"
    ]);

    const scene = new WebScene({
      portalItem: {
        id: "cb95334ab0974b49b7b2fa1837767b17"
      }
    });

    const view = new SceneView({
      map: scene,
      container: "viewDiv",
      spatialReference: {
        wkid: 28355,
        latestWkid: 28355
      },
      camera: {
        position: {
          "x": 322339.18479371245,
          "y": 5810783.684337389,
          "z": 630.5959583771348,
          spatialReference: {
            wkid: 28355
          }
        },
        heading: 320,
        tilt: 72.5
      }
    });

    await view.when();
    window.view = view;

    this.setState({
      view,
      layers: scene.allLayers
    })
  }

  render() {
    return (
      <div id="viewDiv" className="viewDiv">
        <Slider layers={this.state.layers} view={this.state.view} />
      </div>
    )
  }
}

export default SceneView;