import React, { Component } from 'react';
import { Sidebar, Menu, Icon, Segment, Button, Image } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { isEmpty, find } from 'lodash';
import DMModal from './dmmodal';

import { connect } from 'react-redux';
import { createDMChannelname } from '../redux/actions';

class SubSidebar extends Component {
    
    check = (match, location, user) => {
        const { currentChannel, currentUser } = this.props;
        return currentChannel.name === createDMChannelname(user, currentUser.userName);
    }

    render() {
        const { sidebar, currentUser, channels, users } = this.props;
        if (isEmpty(currentUser)) {
            return <Sidebar as={Menu}
                animation='slide along'
                width='wide'
                visible={sidebar.visible}
                icon='labeled'
                vertical
                id='sidebar-container'>
                <Segment basic padded>
                    <Icon name='warning' circular size='huge' />
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
                        visible={sidebar.visible}
                        vertical
                        id='sidebar-container'
                    >
                        {channels !== undefined && channels.map(channel => {
                            return (!channel.name.includes(":")) && (
                                <Menu.Item
                                    key={`key-${channel.id}`}
                                    as={NavLink} to={{ pathname: `/messages/${channel.name}` }}
                                    className='channel-item'
                                >
                                    {(channel.private) ? (
                                        <Icon name='lock' />
                                    ) : (
                                            <Icon name='world' />
                                        )}
                                    {channel.name}
                                    <Icon name='info circle' className='channel-settings-icon' />
                                </Menu.Item>
                            )
                        })}
                        <Menu.Item className='bottom-menu-item'>
                            <Button animated='vertical' fluid inverted>
                                <Button.Content hidden>add channel</Button.Content>
                                <Button.Content visible>
                                    <Icon name='plus' />
                                </Button.Content>
                            </Button>
                        </Menu.Item>
                    </Sidebar>
                )
            } else {
                return (
                    <Sidebar as={Menu}
                        animation='slide along'
                        visible={sidebar.visible}
                        vertical
                        id='sidebar-container'
                    >
                        {channels !== undefined && channels.map(channel => {
                            if (channel.name.includes(":")) {
                                var user = find(channel.name.split(':'), n => n !== currentUser.userName);
                                if (user === undefined) user = currentUser.userName;
                            }
                            return (channel.name.includes(":")) && (
                                <Menu.Item
                                    key={`key-${channel.id}`}
                                    as={NavLink} to={{ pathname: `/messages/${channel.name}` }}
                                    className='channel-item'
                                    isActive={(match, location) => this.check(match, location, user)}
                                >
                                    {(channel.private) ? (
                                        <Icon name='lock' />
                                    ) : (
                                            <Icon name='world' />
                                        )}
                                    {user}
                                    <Icon name='info circle' className='channel-settings-icon'/>
                                </Menu.Item>
                            )
                        })}
                        <Menu.Item className='bottom-menu-item'>
                            <DMModal />
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
        channels: state.channels,
        users: state.users,
        currentChannel: state.currentChannel,
    }
}

export default withRouter(connect(mapStateToProps)(SubSidebar));
