import React, { Component } from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import logo from '../assets/circlelogo.svg';

import { connect } from 'react-redux';

class MainSidebar extends Component {

  toggle = (e) => {
    const { sidebar, dispatch } = this.props;
    dispatch({ type: "UPDATE VISIBLE SIDEBAR", payload: !sidebar.visible });
  }

  open = (e, activeMenu) => {
    const { dispatch } = this.props;
    dispatch({ type: "UPDATE VISIBLE SIDEBAR", payload: true });
    dispatch({ type: "UPDATE ACTIVE SIDEBAR", payload: activeMenu });
  }

  render() {
    const { sidebar } = this.props;

    return (
      <Menu vertical fixed='left' icon='labeled' id='main-sidebar-container' pointing>
        <Menu.Item as={Link} to='/messages/general' className='main-logo'>
          <Image src={logo} id='sidebar-logo' />
          <div className='main-title'>howl</div>
        </Menu.Item>
        <Menu.Item name='channels' active={sidebar.activeMenu === 'channels' && sidebar.visible} onClick={(event) => this.open(event, 'channels')}>
          <Icon name='hashtag' />
          Channels
        </Menu.Item>
        <Menu.Item name='users' active={sidebar.activeMenu === 'users' && sidebar.visible} onClick={(event) =>this.open(event, 'users')}>
          <Icon name='users' />
          Users
        </Menu.Item>
        <Menu.Item className='bottom-menu-item' onClick={this.toggle}>
          <Icon name='columns' />
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sidebar: state.sidebar,
  }
}

export default connect(mapStateToProps)(MainSidebar);
