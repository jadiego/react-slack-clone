import React, { Component } from 'react';
import View from './View';
import { find } from 'lodash';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchChannels, fetchUsers, fetchChannelMessages, fetchLinkToChannel, fetchCreateChannel, initiateWebSocketConnection } from '../actions'

class ViewContainer extends Component {
    componentWillMount() {
        this.props.initiateWebSocketConnection()
        this.props.fetchUsers()
            .then(resp => {
                return this.props.fetchChannels()
            })
            .then(resp => {
                if (this.props.match.params.channelname.includes("@")) {
                    return this.props.fetchChannelMessages(null, this.props.match.params.channelname.substring(1))
                } else {
                    return this.props.fetchChannelMessages(this.props.match.params.channelname)
                }
            })
            .then(resp => {
                return this.props.fetchLinkToChannel(this.props.currentChannel.id)
            })
    }

    render() {
        return (
            <View {...this.props} />
        )
    }
}

const mapStateToProps = (state) => {
    return { ...state }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchChannelMessages,
        fetchChannels,
        fetchUsers,
        fetchLinkToChannel,
        fetchCreateChannel,
        initiateWebSocketConnection
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer)
