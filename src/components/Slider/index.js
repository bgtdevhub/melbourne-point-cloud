import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './index.css';

class Slider extends Component {

  constructor(props) {
    super(props);

    this.sliderShowHideRef = React.createRef();
  }

  getSummaryStatisticsForAllLayers(summaryStatisticsArray) {

    const minArray = [];
    const maxArray = [];

    summaryStatisticsArray.forEach(summaryStatistics => {
      minArray.push(summaryStatistics.min);
      maxArray.push(summaryStatistics.max);
    });

    const min = Math.min(...minArray);
    const max = Math.max(...maxArray);

    return {
      min,
      max
    }
  }

  async componentDidUpdate() {
    const [
      colorRendererCreator,
      ColorSlider,
      PointCloudStretchRenderer,
      summaryStatistics
    ] = await esriLoader.loadModules([
      "esri/renderers/smartMapping/creators/color",
      "esri/widgets/ColorSlider",
      "esri/renderers/PointCloudStretchRenderer",
      "esri/renderers/smartMapping/statistics/summaryStatistics"
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

    const statisticsArray = [];

    await Promise.all(this.props.layers.items.map(async layer => {
      const statistics = await summaryStatistics({
        layer,
        field: "ELEVATION"
      })

      statisticsArray.push(statistics);
    }));

    sliderParams.statistics = {...this.getSummaryStatisticsForAllLayers(statisticsArray)};
    sliderParams.visualVariable = {
      type: "color",
      field: "ELEVATION",
      stops: response.renderer.stops
    }

    if (this.props.showSlider) {
      if (!this.colorSlider) {
        this.colorSlider = new ColorSlider(sliderParams);

        this.stretchRenderer = new PointCloudStretchRenderer({
          field: "ELEVATION",
          pointSizeAlgorithm: {
            type: "fixed-size",
            useRealWorldSymbolSizes: false,
            size: 2
          },
          pointsPerInch: 25,
          stops: this.colorSlider.visualVariable.stops
        });

        this.props.layers.items.forEach(layer => {
          layer.renderer = this.stretchRenderer;
        })

        this.sliderShowHideRef.current.classList.remove("hide");
        this.sliderShowHideRef.current.classList.add("show");

        this.colorSlider.on("data-change", () => {
          this.stretchRenderer = new PointCloudStretchRenderer({
            field: "ELEVATION",
            pointSizeAlgorithm: {
              type: "fixed-size",
              useRealWorldSymbolSizes: false,
              size: 2
            },
            pointsPerInch: 25,
            stops: this.colorSlider.visualVariable.stops
          });

          this.props.layers.items.forEach(layer => {
            layer.renderer = this.stretchRenderer;
          })
        });
      } else {
        this.props.layers.items.forEach(layer => {
          layer.renderer = this.stretchRenderer;
        });

        this.sliderShowHideRef.current.classList.remove("hide");
        this.sliderShowHideRef.current.classList.add("show");
      }
    } else {
      this.props.layers.items.forEach(layer => {
        layer.renderer = null;
      });

      this.sliderShowHideRef.current.classList.remove("show");
      this.sliderShowHideRef.current.classList.add("hide");
    }
  }

  render() {
    return (
      <div className="sliderShowHide" ref={this.sliderShowHideRef}>
        <div id="sliderDiv">
        </div>
      </div>
    )
  }
}

export default Slider;