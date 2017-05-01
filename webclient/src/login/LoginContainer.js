import React, { Component } from 'react';
import Login from './Login';
import {Auth} from '../Auth';

class LoginContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            emailaddress: "",
            redirectToReferrer: false,
            loading: false,
            error: false,
            errmsg: ""
        }
    }

    handlePasswordChange = (event) => this.setState({ password: event.target.value })
    handleEmailChange = (event) => this.setState({ emailaddress: event.target.value })

    handleSignInSubmit = (event) => {
        event.preventDefault();
        Auth.authenticate(this, this.state.emailaddress, this.state.password)
    }

    render() {
        return (
            <Login 
            {...this.state}
            handleEmailChange={this.handleEmailChange}
            handlePasswordChange={this.handlePasswordChange}
            handleSignInSubmit={this.handleSignInSubmit}

            />
        )
    }
}

export default LoginContainer