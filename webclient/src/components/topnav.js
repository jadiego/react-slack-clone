import React, { Component } from 'react';
import { Segment, Image, Header, Button, Popup } from 'semantic-ui-react';
import logo from '../assets/circlelogo.svg';
import { isEmpty } from 'lodash';

import { bindActionCreators } from 'redux';
import { signout } from '../redux/actions';
import { connect } from 'react-redux';

import '../styles/topnav.css';

class TopNav extends Component {
  
  signout = (e) => {
    e.preventDefault();
    this.props.signout()
  }

  render() {
    const { currentUser } = this.props;
    return (
      <Segment basic id='top-navbar-container'>
        <Header className='navbar-title'>
          <Image src={logo} />
          <span>howl</span>

          {(!isEmpty(currentUser)) && (
            <Popup
              trigger={<Image src={currentUser.photoURL} shape='rounded' wrapped className='profile-image'/>}
              content={<Button className='signout-button' onClick={this.signout}>Sign out</Button>}
              basic
              on='click'
            />
          )}
        </Header>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    signout
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
