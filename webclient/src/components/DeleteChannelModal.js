import React, { Component } from 'react';
import { Segment, Modal, Icon, Popup, Button } from 'semantic-ui-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchDeleteChannel } from '../actions';


class DeleteChannelModal extends Component {
    state = {
        visible: false
    }

    hideModal = (e) => this.setState({ visible: false })

    showModal = (e) => this.setState({ visible: true })

    delete = (event, channelid) => {
        event.preventDefault()
        this.props.fetchDeleteChannel(this, channelid)
    }

    render() {
        const { visible } = this.state
        const { channel } = this.props
        return (
            <Modal
                trigger={
                    <Button basic color='red' onClick={this.showModal}>Delete</Button>
                }
                open={visible}
                onClose={this.hideModal}
                closeIcon='close'
                basic
            >
                <Modal.Header as='h2'> <Icon name='trash' color='red' />Delete Channel</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this channel? Once it's deleted, the content within the channel including <strong>all</strong> the messages within, will be gone <strong>forever</strong>.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='green' inverted onClick={this.hideModal}>
                        <Icon name='long arrow left' /> Cancel
                        </Button>
                    <Button inverted color='red' onClick={(event) => this.delete(event, channel.id)}>
                        <Icon name='trash outline' /> Delete
                        </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchDeleteChannel
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(DeleteChannelModal)