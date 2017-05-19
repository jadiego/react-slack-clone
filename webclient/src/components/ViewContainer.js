import React, { Component } from 'react';
import View from './View';
import _, { find, reduce, isEqual } from 'lodash';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchChannels, fetchUsers, fetchChannelMessages, setCurrentChannel, fetchLinkToChannel } from '../actions'

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
        let found = _.find(this.props.channels, (c) => {
            return c.name = user.userName
        })
        console.log(found, user)
        
    }

    render() {
        return (
            <View {...this.props} directMessage={this.directMessage}/>
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
        fetchLinkToChannel
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer)