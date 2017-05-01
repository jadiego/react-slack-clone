import React, { Component } from 'react';
import { Segment, Header, Image, Form, Button, Message, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './login.css';
import logo from '../images/chat.svg';
import logooutline from '../images/chat-outline.png';
import PropTypes from 'prop-types';

class Signup extends Component {

    render() {
        return (
            <Segment.Group id='login-container' horizontal>
                <Segment basic id='login-container-left'>
                    <Header as='h2' textAlign='center'>
                        <Image src={logo}></Image>
                        <Header.Content>Chat</Header.Content>
                    </Header>

                    <Form id='signup-form' onSubmit={event => this.props.handleNewUserSubmit(event)} loading={this.props.loading} warning={this.props.error}>
                        <Header textAlign='center' as='h1'> Get started with <strong>Chat</strong> </Header>
                        <Header textAlign='center' as='h3'> Sign up with a free account</Header>
                        <Form.Field>
                            <input placeholder='First Name' type='text' value={this.props.firstname} onChange={event => this.props.handleFirstNameChange(event)} />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Last Name' type='text' value={this.props.lastname} onChange={event => this.props.handleLastNameChange(event)} />
                        </Form.Field>
                        <Form.Field required>
                            <input placeholder='Username' type='text' value={this.props.username} onChange={event => this.props.handleUsernameChange(event)} />
                        </Form.Field>
                        <Form.Field required>
                            <input placeholder='Email Address' type='email' value={this.props.emailaddress} onChange={event => this.props.handleEmailChange(event)} />
                        </Form.Field>
                        <Form.Field required>
                            <input placeholder='Password' type='password' value={this.props.password} onChange={event => this.props.handlePasswordChange(event)} />
                        </Form.Field>
                        
                        <Form.Field required>
                            <input placeholder='Confirm Password' type='password' value={this.props.passwordconf} onChange={event => this.props.handlePasswordConfChange(event)} />
                        </Form.Field>
                        <Button className="submit-button" fluid={true} onClick={event => this.props.handleNewUserSubmit(event)}>Submit</Button>
                        <Message warning>{this.props.errmsg}</Message>
                        <Segment textAlign='center' as='p' basic>
                            Already have an account? 
                            <Link to='/login'> Log In</Link>
                        </Segment>

                    </Form>

                    <Segment as={Container} fluid textAlign='center' id='credit' basic>Icons made by <a href="http://www.flaticon.com/authors/madebyoliver" title="Madebyoliver">Madebyoliver</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></Segment>
                </Segment>
                <Segment basic id='login-container-right'>
                    <Image src={logooutline} centered></Image>
                </Segment>
            </Segment.Group>
        )
    }
}

Signup.propTypes = {
    handleNewUserSubmit: PropTypes.func.isRequired,
    handleEmailChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    handlePasswordConfChange: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handleFirstNameChange: PropTypes.func.isRequired,
    handleLastNameChange: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
}

export default Signup