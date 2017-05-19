import React, { Component } from 'react';
import Signup from './Signup';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchSignUp } from '../actions'



class SignupContainer extends Component {
    state = {
        e: "",
        u: "",
        fn: "",
        ln: "",
        p1: "",
        p2: ""
    }

    handleEmailChange = (event) => this.setState({ e: event.target.value })
    handleUsernameChange = (event) => this.setState({ u: event.target.value })
    handlePasswordChange = (event) => this.setState({ p1: event.target.value })
    handlePasswordConfChange = (event) => this.setState({ p2: event.target.value })
    handleFirstNameChange = (event) => this.setState({ fn: event.target.value })
    handleLastNameChange = (event) => this.setState({ ln: event.target.value })

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
                {...this.props}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        fetching: state.fetching,
        fetchError: state.fetchError,
        currentUser: state.currentUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchSignUp,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer)