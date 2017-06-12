import React, { Component } from 'react';
import { Segment, Image, Header, Button, Popup } from 'semantic-ui-react';
import logo from '../assets/circlelogo.svg';
import { isEmpty } from 'lodash';

import { bindActionCreators } from 'redux';
import { fetchSignOut } from '../redux/actions';
import { connect } from 'react-redux';

import '../styles/topnav.css';

class TopNav extends Component {
  
  signout = (e) => {
    e.preventDefault();
    this.props.fetchSignOut()
  }

  render() {
    const { currentUser } = this.props;
    console.log(isEmpty(currentUser), localStorage.getItem("auth"))
    return (
      <Segment basic id='top-navbar-container'>
        <Header className='navbar-title'>
          <Image src={logo} />
          <span>howl</span>

          {(!isEmpty(currentUser) && localStorage.getItem("auth")) && (
            <Popup
              trigger={<Image src={currentUser.photoUrl} />}
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
    fetchSignOut
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
