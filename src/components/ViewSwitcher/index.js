import React, { Component } from 'react';
import './index.css';

class ViewSwitcher extends Component {

  constructor(props) {
    super(props);

    this.viewSwitcherDivRef = React.createRef();
    this.switcherTextRef = React.createRef();

    this.state = {
      switchToColor: true
    }
  }

  componentDidUpdate() {
    const switcherImage = this.state.switchToColor ?  "url('img/color.png')" : "url('img/point.png')";
    const switcherText = this.state.switchToColor ? "<p class='smaller-text'>Switch to</p> Elevation <p class='smaller-text'>View</p>"
            : "<p class='smaller-text'>Switch to</p> True Color <p class='smaller-text'>View</p>";

    this.viewSwitcherDivRef.current.style.backgroundImage = switcherImage;
    this.switcherTextRef.current.innerHTML = switcherText;
  }

  switchView() {
    this.setState({
      switchToColor: !this.state.switchToColor
    });

    this.props.switchView();
  }

  render() {
    return (
      <div>
        { this.props.showSwitcher && 
          <div ref={this.viewSwitcherDivRef} className="viewSwitcherDiv" onClick={() => this.switchView()}>
            <div className="info">
              <div ref={this.switcherTextRef}></div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default ViewSwitcher;