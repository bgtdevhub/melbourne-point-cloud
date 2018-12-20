import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './index.css';

class Slider extends Component {

  state = {
  }

  async componentDidUpdate() {
    const [
      colorRendererCreator,
      ColorSlider,
      PointCloudStretchRenderer
    ] = await esriLoader.loadModules([
      "esri/renderers/smartMapping/creators/color",
      "esri/widgets/ColorSlider",
      "esri/renderers/PointCloudStretchRenderer"
    ]);
    
    const elevationLayer = this.props.layers.items[0];

    const colorParams = {
      layer: elevationLayer,
      field: "ELEVATION",
      theme: "high-to-low"
    };

    const sliderParams = {
      numHandles: 2,
      syncedHandles: false,
      container: "sliderDiv"
    };

    const response = await colorRendererCreator.createPCContinuousRenderer(colorParams);

    sliderParams.statistics = response.statistics;

    sliderParams.visualVariable = {
      type: "color",
      field: "ELEVATION",
      stops: response.renderer.stops
    }

    const colorSlider = new ColorSlider(sliderParams);

    colorSlider.on("data-change", function() {
      var stretchRenderer = new PointCloudStretchRenderer({
        field: "ELEVATION",
        pointSizeAlgorithm: {
          type: "fixed-size",
          useRealWorldSymbolSizes: false,
          size: 2
        },
        pointsPerInch: 25,
        stops: colorSlider.visualVariable.stops
      });
      elevationLayer.renderer = stretchRenderer;
    });
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div id="sliderDiv">
      </div>
    )
  }
}

export default Slider;