import React, { Component } from 'react';
import Messages from './Messages';
import './messages.css'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeTextArea, postMessage } from '../actions'

class MessagesContainer extends Component {
    
    render() {
        return (
            <Messages {...this.props} />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        currentChannel: state.currentChannel,
        users: state.users,
        newMessage: state.newMessage,
        channels: state.channels
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        changeTextArea,
        postMessage
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer)