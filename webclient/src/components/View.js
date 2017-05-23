import React, { Component } from 'react';
import { Menu, Image, Segment, Sidebar, Icon } from 'semantic-ui-react';
import './view.css';
import logooutline from '../images/chat-outline.png';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';

import ProfilePopup from './ProfilePopupContainer';
import MessagesContainer from '../messages/MessagesContainer';
import ProfileContainer from '../profile/ProfileContainer';

class View extends Component {
    render() {
        let {
            channels,
            users,
            currentUser,
            fetchChannelMessages,
            directMessage,
        } = this.props
        return (
            <div id='messages-container'>
                <Menu id='sidebar' vertical fixed='left' size='mini'>
                    <Menu.Item fitted as={Link} to='/messages'>
                        <Image className='logo' wrapped src={logooutline}></Image>
                    </Menu.Item>
                </Menu>
                <Sidebar.Pushable as={Segment} className='messages-pushable'>
                    <Sidebar as={Menu} animation='push' visible tabular vertical id='left'>
                        <ProfilePopup />
                        <Menu.Item header className='menu-header'>
                            <Icon name='hashtag' color='orange'/>
                            <Icon name='plus' />
                            Channels
                        </Menu.Item>
                        {channels.map(channel =>
                            !channel.name.includes(currentUser.userName) && (
                                <Menu.Item
                                    key={`key-${channel.id}`}
                                    as={NavLink} to={{ pathname: `/messages/${channel.name}` }}
                                    className='channel-item'
                                    onClick={() => fetchChannelMessages(channel.name)}
                                    activeClassName='active'
                                    activeStyle={{
                                        border: "none",
                                        backgroundColor: "rgba(249, 92, 60, 0.8)",
                                        color: "white"
                                    }}
                                >
                                    <Image src='https://g.flockusercontent.com/default-group-1.png' inline shape='rounded' spaced width={30} />
                                    {channel.name}
                                </Menu.Item>
                            )
                        )}
                        <Menu.Item header className='menu-header'>
                            <Icon name='at' color='orange'/>
                            Direct messages
                        </Menu.Item>
                        {users.map(user =>
                            <Menu.Item
                                key={`key-${user.id}`}
                                as={NavLink} to={{ pathname: `/messages/@${user.userName}` }}
                                className='channel-item'
                                activeClassName='active'
                                activeStyle={{
                                    border: "none",
                                    backgroundColor: "rgba(249, 92, 60, 1)",
                                    color: "white"
                                }}
                                onClick={() => fetchChannelMessages(null, user.userName, user.id)}
                            >
                                <Image src={user.photoURL} inline shape='rounded' spaced width={30} />
                                {user.userName}
                            </Menu.Item>
                        )}
                    </Sidebar>
                    <Sidebar.Pusher id='center'>
                        <Switch>
                            <Route exact path="/profile" component={ProfileContainer} />
                            <Route exact path="/messages/@:username" component={MessagesContainer} />
                            <Route exact path="/messages/:channelname" component={MessagesContainer} />
                        </Switch>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

export default View
