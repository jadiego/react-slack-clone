import React, { Component } from 'react';
import { Popup, Segment, Card, Icon, Image, List, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class ProfilePopup extends Component {
    render() {
        let {
            currentUser,
            fetchSignOut,
        } = this.props

        const popoverstyle = {
            borderRadius: 0,
            padding: '0px',
            width: '300px'
        }
        return (
            <Popup
                trigger={
                     <Card fluid id='profile' as='div'>
                        <Card.Content>
                            <Card.Description>
                                <strong>Profile</strong>
                            </Card.Description>
                            <div>
                                <Icon name='settings' id='edit-icon' color='orange' />
                                <Image floated='left' size='mini' src={currentUser.photoURL} />
                                <Card.Header>@{currentUser.userName}</Card.Header>
                                <Card.Meta>{currentUser.firstName} {currentUser.lastName}</Card.Meta>
                            </div>
                        </Card.Content>
                    </Card>
                }
                on='click'
                position='bottom center'
                wide={true}
                style={popoverstyle}>
                <Popup.Content>
                    <Segment.Group as={List} selection verticalAlign='middle' divided id='popup-menu'>
                        <List.Item disabled>
                            <Header as='h5' color='orange'>Profile Settings</Header>
                        </List.Item>
                        <List.Item as={Link} to='/profile'>
                            <Image floated='left' size='mini' src={currentUser.photoURL} />
                            <List.Content>
                                <List.Header>@{currentUser.userName}</List.Header>
                                <List.Description>{currentUser.firstName} {currentUser.lastName}</List.Description>
                            </List.Content>
                            <Icon name='pencil' className='profile-menu-icon' color='orange' />
                        </List.Item>
                        <List.Item onClick={fetchSignOut}>
                            <List.Header>Sign out</List.Header>
                            <List.Content>{currentUser.email}</List.Content>
                        </List.Item>
                    </Segment.Group>
                </Popup.Content>
            </Popup>
        )
    }

}

export default ProfilePopup