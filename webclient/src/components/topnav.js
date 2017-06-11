import React, { Component } from 'react';
import { Segment, Image, Header } from 'semantic-ui-react';
import logo from '../assets/circlelogo.svg';

import '../styles/topnav.css';

class TopNav extends Component {
  render() {
    return (
      <Segment basic id='top-navbar-container'>
        <Header className='navbar-title'>
          <Image src={logo}/>
          <span>howl</span>
        </Header>
      </Segment>
    );
  }
}

export default TopNav;
