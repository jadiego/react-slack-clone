import React, { Component } from 'react';
import View from './View';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchChannels, fetchUsers, fetchCheckSession } from '../actions'

class ViewContainer extends Component {
    componentDidMount() {
        this.props.fetchChannels()
        this.props.fetchUsers()
    }


    render() {
        return (
            <View {...this.props}/>
        )
    }
}

const mapStateToProps = (state) => {
    return {...state}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchCheckSession,
        fetchChannels,
        fetchUsers
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer)