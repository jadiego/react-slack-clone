import React, { Component } from 'react';
import Messages from './Messages';
import './messages.css'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


class MessagesContainer extends Component {


    // fetchLinktoChannel = (channel) => {
    //     fetch(`${apiRoot}channels/${channel.id}`, {
    //         method: "LINK",
    //         mode: "cors",
    //         headers: new Headers({
    //             "Authorization": localStorage.getItem(storageKey)
    //         })
    //     })
    //         .then(handleResponse)
    //         .then(data => {this.forceUpdate();console.log(data)})
    //         .catch(error => console.log("error: ", error))
    // }

    // handleTextAreaChange = (e) => {
    //     e.preventDefault()
    //     this.setState({ textareabody: e.target.value })
    // }

    // handleTextAreaSubmit = (e) => {
    //     e.preventDefault()
    //     if (e.keyCode === 13) {
    //         fetch(`${apiRoot}messages`, {
    //             method: "POST",
    //             mode: "cors",
    //             headers: new Headers({
    //                 "Content-Type": contentTypeJSONUTF8,
    //                 "Authorization": localStorage.getItem(storageKey)
    //             }),
    //             body: JSON.stringify({
    //                 channelid: this.state.channel.id,
    //                 body: this.state.textareabody
    //             })
    //         })
    //             .then(handleResponse)
    //             .then(data => {
    //                 this.setState({ textareabody: "" })
    //             })
    //             .catch(error => console.log("error: ", error))
    //     }
    // }

    // handleItemClick = (e, { name }) => this.setState({ activeRightSidebarItem: name })

    render() {
        return (
            <Messages {...this.props} />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        fetching: state.fetching,
        currentUser: state.currentUser,
        currentChannel: state.currentChannel,
        users: state.users,
        newMessage: state.newMessage,
        channels: state.channels
    }
}

export default connect(mapStateToProps)(MessagesContainer)