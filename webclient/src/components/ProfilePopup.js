import React, { Component } from 'react';
import { Popup, Segment, Card, Icon, Image, List, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class ProfilePopup extends Component {
    render() {
        console.log(this.props.user)

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
                                <Image floated='left' size='mini' src={this.props.user.photoURL} />
                                <Card.Header>@{this.props.user.userName}</Card.Header>
                                <Card.Meta>{this.props.user.firstName} {this.props.user.lastName}</Card.Meta>
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
                            <Image floated='left' size='mini' src={this.props.user.photoURL} />
                            <List.Content>
                                <List.Header>@{this.props.user.userName}</List.Header>
                                <List.Description>{this.props.user.firstName} {this.props.user.lastName}</List.Description>
                            </List.Content>
                            <Icon name='pencil' className='profile-menu-icon' color='orange' />
                        </List.Item>
                        <List.Item onClick={this.props.handleSignOut}>
                            <List.Header>Sign out</List.Header>
                            <List.Content>{this.props.user.email}</List.Content>
                        </List.Item>
                    </Segment.Group>
                </Popup.Content>
            </Popup>
        )
    }

}

export default ProfilePopup