import React, { Component } from 'react';
import { Segment, Header, Image, Form, Button, Message, Container } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import './login.css';
import logo from '../images/chat.svg';
import logooutline from '../images/chat-outline.png';
import PropTypes from 'prop-types';

class Signup extends Component {

    render() {
        let {
            fetching,
            fetchError,
            currentUser,
            fetchSignUp,
            e, u, fn, ln, p1, p2,
            handleEmailChange,
            handleFirstNameChange,
            handleLastNameChange,
            handlePasswordChange,
            handlePasswordConfChange,
            handleUsernameChange
        } = this.props

        if (!isEmpty(currentUser)) {
            console.log("logged in, redirecting to home page")
            return (
                <Redirect to='/messages/general' />
            )
        }

        return (
            <Segment.Group id='login-container' horizontal>
                <Segment basic id='login-container-left'>
                    <Header as='h2' textAlign='center'>
                        <Image src={logo}></Image>
                        <Header.Content>Chat</Header.Content>
                    </Header>

                    <Form id='signup-form' onSubmit={(event) => fetchSignUp(event, e, u, fn, ln, p1, p2)} loading={fetching !== 0} warning={fetchError.length > 0}>
                        <Header textAlign='center' as='h1'> Get started with <strong>Chat</strong> </Header>
                        <Header textAlign='center' as='h3'> Sign up with a free account</Header>
                        <Form.Field>
                            <input placeholder='First Name' type='text' value={fn} onChange={event => handleFirstNameChange(event)} />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Last Name' type='text' value={ln} onChange={event => handleLastNameChange(event)} />
                        </Form.Field>
                        <Form.Field required>
                            <input placeholder='Username' type='text' value={u} onChange={event => handleUsernameChange(event)} />
                        </Form.Field>
                        <Form.Field required>
                            <input placeholder='Email Address' type='email' value={e} onChange={event => handleEmailChange(event)} />
                        </Form.Field>
                        <Form.Field required>
                            <input placeholder='Password' type='password' value={p1} onChange={event => handlePasswordChange(event)} />
                        </Form.Field>
                        
                        <Form.Field required>
                            <input placeholder='Confirm Password' type='password' value={p2} onChange={event => handlePasswordConfChange(event)} />
                        </Form.Field>
                        <Message warning>{fetchError}</Message>
                        <Button className="submit-button" fluid={true} onClick={(event) => fetchSignUp(event, e, u, fn, ln, p1, p2)}>Submit</Button>
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
    handleEmailChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    handlePasswordConfChange: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handleFirstNameChange: PropTypes.func.isRequired,
    handleLastNameChange: PropTypes.func.isRequired,
}

export default Signup