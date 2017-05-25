import React, { Component } from 'react';
import Messages from './Messages';
import './messages.css'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeTextArea, postMessage } from '../actions'

class MessagesContainer extends Component {
    state = {
        activeMenu: "info",
        name: this.props.currentChannel.name,
        description: this.props.currentChannel.description,
    }

    handleDescription = (e) => this.setState({ description: e.target.value })

    handleItemClick = (e, { name }) => this.setState({ activeMenu: name })

    handleName = (e) => this.setState({ name: e.target.value })

    render() {
        return (
            <Messages {...this.props} {...this.state}
                handleItemClick={this.handleItemClick}
                handleDescription={this.handleDescription}
                handleName={this.handleName}
            />
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