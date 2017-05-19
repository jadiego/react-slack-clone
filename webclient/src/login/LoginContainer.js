import React, { Component } from 'react';
import Login from './Login';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchAuthenticate, fetchUsers } from '../actions'


class LoginContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            emailaddress: "",
            redirectToReferrer: false,
        }
    }

    handlePasswordChange = (event) => this.setState({ password: event.target.value })
    handleEmailChange = (event) => this.setState({ emailaddress: event.target.value })

    render() {
        return (
            <Login 
            {...this.state}
            {...this.props}
            handleEmailChange={this.handleEmailChange}
            handlePasswordChange={this.handlePasswordChange}

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
        fetchAuthenticate,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)