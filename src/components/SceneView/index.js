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
    const [SceneView, WebScene, PointCloudLayer] = await esriLoader.loadModules([
      "esri/views/SceneView",
      "esri/WebScene",
      "esri/layers/PointCloudLayer"
    ]);

    const cityOfMelbournePC1 = new PointCloudLayer({
      url: "https://tiles.arcgis.com/tiles/KGdHCCUjGBpOPPac/arcgis/rest/services/Tile_010_009/SceneServer",
    });

    const cityOfMelbournePC2 = new PointCloudLayer({
      url: "https://tiles.arcgis.com/tiles/KGdHCCUjGBpOPPac/arcgis/rest/services/Tile_010_010/SceneServer",
    });

    const scene = new WebScene({
      layers: [cityOfMelbournePC1, cityOfMelbournePC2]
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
          "x": 319049.26061052026,
          "y": 5811015.020178071,
          "z": 314.5470930327564,
          spatialReference: {
            wkid: 28355
          }
        },
        heading: 321,
        tilt: 75
      }
    });

    await view.when();

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