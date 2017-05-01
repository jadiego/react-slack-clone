import React, { Component } from 'react';
import Signup from './Signup';
import { Auth } from '../Auth';


class SignupContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emailaddress: "",
            username: "",
            firstname: "",
            lastname: "",
            password: "",
            passwordconf: "",
            loading: false,
            error: false,
            errmsg: ""
        }
    }

    handleEmailChange = (event) => this.setState({ emailaddress: event.target.value })
    handleUsernameChange = (event) => this.setState({ username: event.target.value })
    handlePasswordChange = (event) => this.setState({ password: event.target.value })
    handlePasswordConfChange = (event) => this.setState({ passwordconf: event.target.value })
    handleFirstNameChange = (event) => this.setState({ firstname: event.target.value })
    handleLastNameChange = (event) => this.setState({ lastname: event.target.value })


    //Submits the fields in the form to the API server with the following prompts in order
    //f, e, u, fn, ln, p1, p2
    handleNewUserSubmit = (event) => {
        event.preventDefault();
        Auth.signup(this, this.state.emailaddress, this.state.username, this.state.firstname, this.state.lastname, this.state.password, this.state.passwordconf)
    }

    render() {
        return (
            <Signup
                handleNewUserSubmit={this.handleNewUserSubmit}
                handleEmailChange={this.handleEmailChange}
                handlePasswordChange={this.handlePasswordChange}
                handlePasswordConfChange={this.handlePasswordConfChange}
                handleUsernameChange={this.handleUsernameChange}
                handleFirstNameChange={this.handleFirstNameChange}
                handleLastNameChange={this.handleLastNameChange}
                {...this.state}
            />
        )
    }
}

export default SignupContainer