import React, { Component } from 'react';
import Messages from './Messages';
import './messages.css'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchChannelMessages } from '../actions'


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

    componentDidUpdate() {
        console.log("updating to: ", this.props.match.params.channelname)
        this.props.fetchChannelMessages(this.props.match.params.channelname)
    }

    componentDidMount() {
        console.log("mounting to: ", this.props.match.params.channelname)
        setTimeout(() => {
            this.props.fetchChannelMessages(this.props.match.params.channelname)
        }, 1000)
        setTimeout(() => {
            this.forceUpdate()
        }, 1300)
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextProps)
        if (nextProps.match.params.channelname !== this.props.match.params.channelname) {
            return true
        } else {
            return false
        }
    }


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

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchChannelMessages,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(MessagesContainer)