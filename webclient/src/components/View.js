import React, { Component } from 'react';
import { Container, Menu, Image, Segment, Sidebar } from 'semantic-ui-react';
import './view.css';
import logooutline from '../images/chat-outline.png';
import { Route, Link } from 'react-router-dom';

import ProfilePopup from './ProfilePopupContainer';
import Messages from '../messages/MessagesContainer';
import Profile from '../profile/ProfileContainer';

class View extends Component {
    render() {
        return (
            <div id='messages-container'>
                <Menu id='sidebar' vertical fixed='left' size='mini'>
                    <Menu.Item fitted as={Link} to='/messages'>
                        <Image className='logo' wrapped src={logooutline}></Image>
                    </Menu.Item>
                </Menu>
                <Sidebar.Pushable as={Segment} className='messages-pushable'>
                    <Sidebar as={Menu} animation='push' visible tabular vertical id='left'>
                        <ProfilePopup {...this.props}/>
                        <Menu.Item>
                            Channels
                            </Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher id='center'>
                            <Container fluid>
                                <Route exact path="/profile" component={Profile} />
                                <Route exact path="/messages" component={Messages} />
                            </Container>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

export default View