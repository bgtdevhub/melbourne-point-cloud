import React, { Component } from 'react';
import './index.css';

class ViewSwitcher extends Component {

  constructor(props) {
    super(props);

    this.viewSwitcherDivRef = React.createRef();

    this.state = {
      isRGBView: true
    }
  }

  componentDidUpdate() {
    const switcherImage = this.state.isRGBView ? "url('img/point.png')" : "url('img/color.png')";

    this.viewSwitcherDivRef.current.style.backgroundImage = switcherImage;
  }

  render() {
    return (
      <div>
        { this.props.showSwitcher && 
          <div ref={this.viewSwitcherDivRef} className="viewSwitcherDiv">
          </div>
        }
      </div>
    )
  }
}

export default ViewSwitcher;