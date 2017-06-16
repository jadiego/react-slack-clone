import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import logo from '../assets/circlelogo.svg';
import { isEmpty } from 'lodash';
import ProfilePopup from './profilepopup';

import { bindActionCreators } from 'redux';
import { signout, setCurrentChannel } from '../redux/actions';
import { connect } from 'react-redux';

import '../styles/topnav.css';

class TopNav extends Component {

  render() {
    const { currentUser } = this.props;
    return (
      <Segment basic id='top-navbar-container'>
        <div className='navbar-title'>
          {(!isEmpty(currentUser)) && (
            <ProfilePopup />
          )}
        </div>
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
    signout,
    setCurrentChannel
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
