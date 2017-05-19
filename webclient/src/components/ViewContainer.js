import React, { Component } from 'react';
import View from './View';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchChannels, fetchUsers, fetchChannelMessages, setCurrentChannel } from '../actions'

class ViewContainer extends Component {
    componentDidMount() {
        console.log("mounting: ", this.props)
        this.props.fetchChannels()
            .then(resp => {
                return this.props.fetchUsers()
            })
            .then(resp => {
                return this.props.fetchChannelMessages(this.props.match.params.channelname)
        })
    }

    render() {
        console.log(this.props)
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
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer)