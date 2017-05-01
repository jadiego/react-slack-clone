import React, { Component } from 'react';
import { Segment, Header, Divider, Form, Icon, Container, Card, Image, Button } from 'semantic-ui-react';
import './profile.css';



class Profile extends Component {
    render() {
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
                            <Image src={this.props.user.photoURL} wrapped/>
                            <Card.Content>
                                <Card.Header>
                                    {this.props.user.firstName} {this.props.user.lastName}
                            </Card.Header>
                                <Card.Meta>
                                    <span>
                                        @{this.props.user.userName}
                                </span>
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name='mail outline' />
                                {this.props.user.email}
                        </Card.Content>
                        </Card>
                    </Segment>
                    <Segment padded='very' className='profile-container'>
                        <Divider horizontal> <Header as='h3'> Update Personal Information </Header></Divider>
                        <Segment basic padded>
                            <Form size='small'>
                                <Segment>
                                    <Form.Input control='Input' label='First Name' type='text' icon='image' />
                                    <Form.Input control='Input' label='Last Name' type='text' icon='image' />
                                    <Button size='tiny' className='submit-update'>Submit</Button>
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