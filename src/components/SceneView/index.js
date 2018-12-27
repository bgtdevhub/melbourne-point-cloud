import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './index.css';

import Slider from '../Slider';
import SizeSlider from '../SizeSlider';
import ViewSwitcher from '../ViewSwitcher';

class SceneView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      view: null,
      layers: [],
      showSwitcher: false,
      showSlider: false,
      showSizeSlider: false,
      pointSize: 2
    }

    this.activeWidget = null;
  }

  async componentDidMount() {
    const [
      SceneView,
      WebScene
    ] = await esriLoader.loadModules([
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
          "x": 322863.9872427298,
          "y": 5812301.9626892535,
          "z": 146.39918199191118,
          spatialReference: {
            wkid: 28355
          }
        },
        heading: 279.7139050297931,
        tilt: 81.76047098002073
      }
    });

    await view.when();
    window.view = view;

    // add the toolbar for the measurement widgets
    view.ui.add("topbar", "top-right");

    this.setState({
      view,
      layers: scene.allLayers,
      showSwitcher: true,
      showSizeSlider: true
    })
  }

  switchView() {
    this.setState({
      showSlider: !this.state.showSlider,
    })
  }

  setPointSize(event) {
    this.setState({
      pointSize: event.target.value
    })
  }

  async setActiveWidget(type) {
    const [
      DirectLineMeasurement3D,
      AreaMeasurement3D
    ] = await esriLoader.loadModules([
      "esri/widgets/DirectLineMeasurement3D",
      "esri/widgets/AreaMeasurement3D"
    ]);

    switch (type) {
      case "distance":
        this.activeWidget = new DirectLineMeasurement3D({
          view: window.view
        });

        // skip the initial 'new measurement' button
        this.activeWidget.viewModel.newMeasurement();

        window.view.ui.add(this.activeWidget, "top-right");
        this.setActiveButton(document.getElementById('distanceButton'));
        break;
      case "area":
        this.activeWidget = new AreaMeasurement3D({
          view: window.view
        });

        // skip the initial 'new measurement' button
        this.activeWidget.viewModel.newMeasurement();

        window.view.ui.add(this.activeWidget, "top-right");
        this.setActiveButton(document.getElementById('areaButton'));
        break;
      case null:
        if (this.activeWidget) {
          window.view.ui.remove(this.activeWidget);
          this.activeWidget.destroy();
          this.activeWidget = null;
        }
        break;
      default:
        return;
    }
  }

  setActiveButton(selectedButton) {
    // focus the view to activate keyboard shortcuts for sketching
    window.view.focus();
    const elements = document.getElementsByClassName("active");
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("active");
    }
    if (selectedButton) {
      selectedButton.classList.add("active");
    }
  }

  distanceButtonClicked(e) {
    this.setActiveWidget(null);
    if (!e.target.classList.contains('active')) {
      this.setActiveWidget('distance');
    } else {
      this.setActiveButton(null);
    }
  }

  areaButtonClicked(e) {
    this.setActiveWidget(null);
    if (!e.target.classList.contains('active')) {
      this.setActiveWidget('area');
    } else {
      this.setActiveButton(null);
    }
  }

  render() {
    return (
      <div id="viewDiv" className="viewDiv">
        <div id="topbar">
          <button className="action-button esri-icon-minus" id="distanceButton" type="button"
            title="Measure distance between two points" onClick={(e) => this.distanceButtonClicked(e)}></button>
          <button className="action-button esri-icon-polygon" id="areaButton" type="button"
            title="Measure area" onClick={(e) => this.areaButtonClicked(e)}></button>
        </div>
        <Slider layers={this.state.layers} view={this.state.view} showSlider={this.state.showSlider} pointSize={this.state.pointSize} />
        <SizeSlider layers={this.state.layers} view={this.state.view} showSizeSlider={this.state.showSizeSlider} pointSize={this.state.pointSize} setPointSize={this.setPointSize.bind(this)}/>
        <ViewSwitcher showSwitcher={this.state.showSwitcher} switchView={() => this.switchView()} />
      </div>
    )
  }
}

export default SceneView;