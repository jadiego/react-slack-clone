import React, { Component } from 'react';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

import '../styles/messages.css';

class Messages extends Component {
  state = { visible: true };

  toggleSideBar = (e) => this.setState({ visible: !this.state.visible})

  render() {
    const { visible } = this.state;
    return (
      <Sidebar.Pushable as={Segment} id='pushable-container'>
        <Sidebar as={Menu} 
          animation='slide along' 
          width='wide' 
          visible={visible} 
          icon='labeled' 
          vertical
          id='sidebar-container'>
          <Menu.Item name='home'>
            <Icon name='home' />
            Home
          </Menu.Item>
          <Menu.Item name='gamepad'>
            <Icon name='gamepad' />
            Games
          </Menu.Item>
          <Menu.Item name='camera'>
            <Icon name='camera' />
            Channels
          </Menu.Item>
          <Button onClick={this.toggleSideBar}>Visible</Button>
        </Sidebar>
        <Sidebar.Pusher>
          <Segment basic>
            <Header as='h3'>Application Content</Header>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default Messages;