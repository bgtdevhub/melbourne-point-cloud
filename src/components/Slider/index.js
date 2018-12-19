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
      lang
    ] = await esriLoader.loadModules([
      "esri/renderers/smartMapping/creators/color",
      "esri/widgets/ColorSlider",
      "esri/core/lang"
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
    elevationLayer.renderer = response.renderer;

    sliderParams.statistics = response.statistics;
    sliderParams.visualVariable = response.renderer;

    const colorSlider = new ColorSlider(sliderParams);

    colorSlider.on("data-change", function() {
      const renderer = elevationLayer.renderer.clone();
      renderer.visualVariable = [lang.clone(colorSlider.visualVariable)];
      elevationLayer.renderer = renderer;
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