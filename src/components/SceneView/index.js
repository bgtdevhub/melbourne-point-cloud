import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './index.css';

import Slider from '../Slider';
import ViewSwitcher from '../ViewSwitcher';

class SceneView extends Component {

  state = {
    view: null,
    layers: [],
    showSwitcher: false,
    showSlider: false
  }

  async componentDidMount() {
    const [SceneView, WebScene] = await esriLoader.loadModules([
      "esri/views/SceneView",
      "esri/WebScene"
    ]);

    const scene = new WebScene({
      portalItem: {
        id: "32bfeb7b3ac945989794ac5970752ea3"
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
          "x": 323107.9219921804,
          "y": 5810906.665562474,
          "z": 630.5959583771349,
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
      layers: scene.allLayers,
      showSwitcher: true
    })
  }

  switchView() {
    this.setState({
      showSlider: !this.state.showSlider
    })
  }

  render() {
    return (
      <div id="viewDiv" className="viewDiv">
        <Slider layers={this.state.layers} view={this.state.view} showSlider={this.state.showSlider} />
        <ViewSwitcher showSwitcher={this.state.showSwitcher} switchView={() => this.switchView()} />
      </div>
    )
  }
}

export default SceneView;