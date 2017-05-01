import React, { Component } from 'react';
import { Segment, Header, Image, Form, Button, Message, Container, Icon } from 'semantic-ui-react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import './login.css';
import logo from '../images/chat.svg';
import logooutline from '../images/chat-outline.png';
import PropTypes from 'prop-types';

class Login extends Component {

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.props

        if (redirectToReferrer) {
            return (
                <Redirect to={from} />
            )
        }

        let warningmessage = null
        if (from.pathname === "/messages" || from.pathname === "/profile") {
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
                    <Form id='login-form' onSubmit={event => this.props.handleSignInSubmit(event)} loading={this.props.loading} warning={this.props.error}>
                        <Header textAlign='center' as='h1'> Sign in </Header>
                        <Form.Field>
                            <input placeholder='Email Address' required type='email' value={this.props.emailaddress} onChange={event => this.props.handleEmailChange(event)} />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Password' required type='password' value={this.props.password} onChange={event => this.props.handlePasswordChange(event)} />
                        </Form.Field>
                        <Button className="submit-button" fluid={true} onClick={event => this.props.handleSignInSubmit(event)}>Submit</Button>
                        <Message warning>{this.props.errmsg}</Message>
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
    handleSignInSubmit: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    handleEmailChange: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
}

export default withRouter(Login)