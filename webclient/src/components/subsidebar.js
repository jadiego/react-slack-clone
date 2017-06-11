import React, { Component } from 'react';
import { Sidebar, Button, Menu, Icon } from 'semantic-ui-react';

import { connect } from 'react-redux';

class SubSidebar extends Component {
    render() {
        const { sidebar } = this.props;
        
        return (
            <Sidebar as={Menu}
                animation='slide along'
                width='wide'
                visible={sidebar.visible}
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
            </Sidebar>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        sidebar: state.sidebar,
    }
}

export default connect(mapStateToProps)(SubSidebar);
