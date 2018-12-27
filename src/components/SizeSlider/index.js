import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './index.css';

class SizeSlider extends Component {

  constructor(props) {
    super(props);

    this.rgbRenderer = null;
    this.sizeSliderDivRef = React.createRef();
  }

  async componentDidUpdate() {
    if (this.props.showSizeSlider) {
      this.sizeSliderDivRef.current.classList.remove("hide");
      this.sizeSliderDivRef.current.classList.add("show");

      const [
        PointCloudRGBRenderer
      ] = await esriLoader.loadModules([
        "esri/renderers/PointCloudRGBRenderer",
      ]);

      this.rgbRenderer = new PointCloudRGBRenderer({
        field: "RGB",
         pointSizeAlgorithm: {
          type: "fixed-size",
          useRealWorldSymbolSizes: false,
          size: this.props.pointSize
        },
        pointsPerInch: 30
      });

      this.props.layers.items.forEach(layer => {
        layer.renderer = this.rgbRenderer;
      })
    }
  }

  render() {
    return (
      <div className="sizeSliderDiv hide" ref={this.sizeSliderDivRef}>
        <span className="tooltiptext">Point Size: <b>{this.props.pointSize}</b></span>
        <div className="slidecontainer">
          <input type="range" min="1" max="10" defaultValue="2" className="slider" id="myRange" onChange={(e) => this.props.setPointSize(e)}></input>
        </div>
      </div>
    )
  }
}

export default SizeSlider;