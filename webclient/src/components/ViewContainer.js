import React, { Component } from 'react';
import View from './View';
import _, { find, reduce, isEqual } from 'lodash';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchChannels, fetchUsers, fetchChannelMessages, setCurrentChannel, fetchLinkToChannel, fetchCreateChannel } from '../actions'

class ViewContainer extends Component {
    componentDidMount() {
        console.log("mounting: ", this.props)
        if (this.props.location.pathname.includes("messages/")) {
            this.props.fetchUsers()
            this.props.fetchChannels()
                .then(resp => {
                    return this.props.fetchChannelMessages(this.props.match.params.channelname)
                })
                .then(resp => {
                    return this.props.fetchLinkToChannel(this.props.currentChannel.id)
                })
        }
    }

    componentWillUpdate(nextProps) {
        console.log(_.reduce(nextProps, (result, value, key) => {
            return _.isEqual(value, this.props[key]) ?
                result : result.concat(key);
        }, []))
    }

    directMessage = (user) => {
        var found = _.find(this.props.channels, (c) => {
            if (c.name.includes(user.userName) && c.name.includes(this.props.currentUser.userName)) {
                return c
            }
        })
        //If the channel is found, then create the channel
        if (found === undefined) {
            console.log(`creating new private dm: dm:${user.userName}:${this.props.currentUser.userName}`)
            let channelname = `dm:${user.userName}:${this.props.currentUser.userName}`
            let privatechan = true
            let description = `Direct messsages between you and ${user.userName}`
            //if the user prompt is the current user, then leave members list empty,
            //server side will automatically add in creator
            if (user.id === this.props.currentUser.id) {
                var members = []
            } else {
                var members = [user.id, this.props.currentUser.id]
            }
            this.props.fetchCreateChannel(channelname, privatechan, description, members)
        } else {
            console.log("redirecting to: ", found)
            this.props.fetchChannelMessages(found.name)
        }
    }

    render() {
        return (
            <View {...this.props} directMessage={this.directMessage} />
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
        fetchCreateChannel
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer)
