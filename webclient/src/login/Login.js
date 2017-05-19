import React, { Component } from 'react';
import { Segment, Header, Image, Form, Button, Message, Container, Icon } from 'semantic-ui-react';
import _, { isEmpty } from 'lodash';
import { Link, Redirect, withRouter } from 'react-router-dom';
import './login.css';
import logo from '../images/chat.svg';
import logooutline from '../images/chat-outline.png';
import PropTypes from 'prop-types';

class Login extends Component {
    

    render() {
        let { emailaddress, 
            password, 
            fetching, 
            fetchError, 
            handleEmailChange, 
            handlePasswordChange, 
            fetchAuthenticate, 
            redirectToReferrer,
            currentUser 
        } = this.props;

        const { from } = this.props.location.state || { from: { pathname: '/' } }

        if (redirectToReferrer) {
            return (
                <Redirect to={from} />
            )
        }

        if (!_.isEmpty(currentUser)) {
            console.log("logged in, redirecting to home page")
            return (
                <Redirect to='/messages' />
            )
        }

        let warningmessage = null
        if (this.props.location.state && !from.pathname.includes("signed out")) {
            warningmessage = <Message id='wrong-route-message' color='yellow'>
                    <Icon name='warning circle'></Icon>
                    You need to sign in to access this page.
                </Message>
        }
        return (
            <Segment.Group id='login-container' horizontal>
                <Segment basic id='login-container-left'>
                    <Header as='h2' textAlign='center'>
                        <Image src={logo}></Image>
                        <Header.Content>Chat</Header.Content>
                    </Header>
                    {warningmessage}
                    <Form id='login-form' onSubmit={(event) => fetchAuthenticate(event, emailaddress, password)} loading={fetching !== 0} warning={fetchError.length > 0}>
                        <Header textAlign='center' as='h1'> Sign in </Header>
                        <Form.Field>
                            <input placeholder='Email Address' required type='email' value={emailaddress} onChange={handleEmailChange} />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Password' required type='password' value={password} onChange={handlePasswordChange} />
                        </Form.Field>
                        <Button className="submit-button" fluid={true} onClick={(event) => fetchAuthenticate(event, emailaddress, password)}>Submit</Button>
                        <Message warning>{fetchError}</Message>
                        <Segment textAlign='center' as='p' basic>
                            Don't have an account?
                        <Link to='/'> Sign Up</Link>
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

Login.propTypes = {
    handlePasswordChange: PropTypes.func.isRequired,
    handleEmailChange: PropTypes.func.isRequired,
}

export default withRouter(Login)