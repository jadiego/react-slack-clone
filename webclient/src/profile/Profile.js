import React, { Component } from 'react';
import { Segment, Header, Divider, Form, Icon, Container, Card, Image, Button, Message } from 'semantic-ui-react';
import './profile.css';

class Profile extends Component {
    render() {
        const { currentUser, fetching, fetchError,
            fetchUpdateCurrentUser, firstname, lastname,
            handleFirstNameChange, handleLastNameChange } = this.props
        return (
            <Segment basic padded='very' id='profile'>
                <Header as='h2'>Account Settings</Header>
                <Divider />
                <Container>
                    <Segment padded='very' className='profile-container'>
                        <Divider horizontal>
                            <Icon name='id card outline' className='profile-icon' size='huge' bordered circular color='orange'></Icon>
                        </Divider>
                        <Card centered>
                            <Image src={currentUser.photoURL} wrapped />
                            <Card.Content>
                                <Card.Header>
                                    {currentUser.firstName} {currentUser.lastName}
                                </Card.Header>
                                <Card.Meta>
                                    <span>
                                        @{currentUser.userName}
                                    </span>
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name='mail outline' />
                                {currentUser.email}
                            </Card.Content>
                        </Card>
                    </Segment>
                    <Segment padded='very' className='profile-container'>
                        <Divider horizontal> <Header as='h3'> Update Personal Information </Header></Divider>
                        <Segment basic padded>
                            <Form size='small' onSubmit={event => fetchUpdateCurrentUser(event, firstname, lastname)} warning={fetch !== 0}>
                                <Segment>
                                    <Form.Input control='Input' label='First Name' type='text' icon='image' value={firstname} onChange={event => handleFirstNameChange(event)} />
                                    <Form.Input control='Input' label='Last Name' type='text' icon='image' value={lastname} onChange={event => handleLastNameChange(event)} />
                                    <Button size='tiny' className='submit-update' onClick={event => fetchUpdateCurrentUser(event, firstname, lastname)}>Submit</Button>
                                    <Message warning>{fetchError}</Message>
                                </Segment>
                            </Form>
                        </Segment>
                    </Segment>
                </Container>
            </Segment>
        )
    }
}

export default Profile