import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

import '../styles/topnav.css';

class TopNav extends Component {
  render() {
    return (
      <Segment basic id='top-navbar-container'>top title showing channel </Segment>
    );
  }
}

export default TopNav;
