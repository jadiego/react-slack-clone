import React, { Component } from 'react';
import { Sidebar, Button, Menu, Icon, Header, Segment } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import { bindActionCreators } from 'redux';
import { getUsers } from '../redux/actions';
import { connect } from 'react-redux';

class SubSidebar extends Component {

    componentWillMount() {
        this.props.getUsers()
    }

    render() {
        const { sidebar, currentUser } = this.props;
        if (isEmpty(currentUser)) {
            return <Sidebar as={Menu}
                animation='slide along'
                width='wide'
                visible={sidebar.visible}
                icon='labeled'
                vertical
                id='sidebar-container'>
                <Segment basic padded>
                    <Icon name='warning' circular size='huge'/>
                    <Segment padded className='clear-black-background'>
                        Login to start chatting with friends and explore the sub-communities
                    </Segment>
                </Segment>
            </Sidebar>
        } else {
            if (sidebar.activeMenu === 'channels') {
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
                )
            } else {
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
                    </Sidebar>
                )
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        sidebar: state.sidebar,
        currentUser: state.currentUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getUsers,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SubSidebar);
