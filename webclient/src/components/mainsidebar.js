import React, { Component } from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';

import logo from '../assets/circlelogo.svg';

import { connect } from 'react-redux';

class MainSidebar extends Component {

  toggle = (e) => {
    const { sidebar, dispatch } = this.props;
    dispatch({ type: "UPDATE VISIBLE SIDEBAR", payload: !sidebar.visible });
  }

  open = (e) => {
    const { sidebar, dispatch } = this.props;
    dispatch({ type: "UPDATE VISIBLE SIDEBAR", payload: true });
  }

  render() {
    const { sidebar } = this.props;

    return (
      <Menu vertical fixed='left' icon='labeled' id='main-sidebar-container' pointing>
        <Menu.Item>
          <Image src={logo} id='sidebar-logo' />
        </Menu.Item>
        <Menu.Item name='channels' active={sidebar.activeMenu === 'channels' && sidebar.visible} onClick={this.open}>
          <Icon name='hashtag' />
          Channels
        </Menu.Item>
        <Menu.Item name='users' active={sidebar.activeMenu === 'users' && sidebar.visible} onClick={this.open}>
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
