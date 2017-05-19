import React, { Component } from 'react';
import ProfilePopup from './ProfilePopup';
import { Auth } from '../Auth';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCheckSession, fetchSignOut } from '../actions'


class ProfilePopupContainer extends Component {

    render() {
        return (
            <ProfilePopup {...this.props} />
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
        fetchSignOut
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfilePopupContainer))