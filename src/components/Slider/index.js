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

  getUnifiedHistogram(histogramArray) {
    const finalHistogram = {...histogramArray[0]};

    for (let i=1; i < histogramArray.length; i++) {
      finalHistogram.bins.forEach((bin, index) => {
        bin.count += histogramArray[i].bins[index].count
      })
    }

    return finalHistogram;
  }

  async componentDidUpdate() {
    const [
      colorRendererCreator,
      ColorSlider,
      PointCloudStretchRenderer,
      summaryStatistics,
      histogram
    ] = await esriLoader.loadModules([
      "esri/renderers/smartMapping/creators/color",
      "esri/widgets/ColorSlider",
      "esri/renderers/PointCloudStretchRenderer",
      "esri/renderers/smartMapping/statistics/summaryStatistics",
      "esri/renderers/smartMapping/statistics/histogram"
    ]);
    
    const elevationLayer = this.props.layers.items[0];

    const colorParams = {
      layer: elevationLayer,
      field: "ELEVATION",
      theme: "high-to-low"
    };

    this.sliderParams = {
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

    this.sliderParams.statistics = {...this.getSummaryStatisticsForAllLayers(statisticsArray)};
    this.sliderParams.visualVariable = {
      type: "color",
      field: "ELEVATION",
      stops: response.renderer.stops
    }

    const histogramArray = [];

    await Promise.all(this.props.layers.items.map(async layer => {
      const histogramParams = {
        layer: layer,
        field: "ELEVATION",
        numBins: 30,
        minValue: this.sliderParams.statistics.min,
        maxValue: this.sliderParams.statistics.max
      };

      const histo = await histogram(histogramParams);
      histogramArray.push(histo);
    }));

    this.sliderParams.histogram = this.getUnifiedHistogram(histogramArray);

    if (this.props.showSlider) {
      if (!this.colorSlider) {
        this.colorSlider = new ColorSlider(this.sliderParams);

        this.stretchRenderer = new PointCloudStretchRenderer({
          field: "ELEVATION",
          pointSizeAlgorithm: {
            type: "fixed-size",
            useRealWorldSymbolSizes: false,
            size: this.props.pointSize
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
              size: this.props.pointSize
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
          this.stretchRenderer.pointSizeAlgorithm.size = this.props.pointSize;
          layer.renderer = this.stretchRenderer;
        });

        this.sliderShowHideRef.current.classList.remove("hide");
        this.sliderShowHideRef.current.classList.add("show");
      }
    } else {
      // this.props.layers.items.forEach(layer => {
      //   layer.renderer = null;
      // });

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