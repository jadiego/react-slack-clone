import 'whatwg-fetch';
import React, { Component } from 'react';
import Profile from './Profile';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUpdateCurrentUser } from '../actions'


class ProfileContainer extends Component {
    state = {
        firstname: "",
        lastname: ""
    }

    handleFirstNameChange = (event) => this.setState({ firstname: event.target.value })
    handleLastNameChange = (event) => this.setState({ lastname: event.target.value })

    render() {
        return (
            <Profile 
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
        fetchUpdateCurrentUser
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)
