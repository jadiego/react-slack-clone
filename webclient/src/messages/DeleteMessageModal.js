import React, { Component } from 'react'
import { Segment, Modal, Icon, Popup, Button } from 'semantic-ui-react'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchDeleteMessage } from '../actions';


class DeleteMessageModal extends Component {
    state = {
        visible: false
    }

    hideModal = (e) => this.setState({ visible: false })

    showModal = (e) => this.setState({ visible: true })

    delete = (event, messageid) => {
        event.preventDefault()
        this.props.fetchDeleteMessage(messageid)
        .then(data => {
            if (data === undefined) {
                //if were here then the channel was succesfully created
                this.setState({ visible: false })
            }
        })
    }

    render() {
        const { visible } = this.state
        const { message } = this.props
        return (
            <Modal
                trigger={
                    <Popup
                        inverted
                        basic
                        trigger={<Icon name='trash' link color='red' onClick={this.showModal}/>}
                        content='Delete'
                    />
                }
                open={visible}
                onClose={this.hideModal}
                closeIcon='close'
                basic
            >
                <Modal.Header as='h2'> <Icon name='trash' color='red' />Delete Message</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this message? Once it's deleted, the content within the message including the text and images will be gone <strong>forever</strong>.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='green' inverted onClick={this.hideModal}>
                        <Icon name='long arrow left' /> Cancel
                        </Button>
                    <Button inverted color='red' onClick={(event) => this.delete(event, message.id)}>
                        <Icon name='trash outline' /> Delete
                        </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchDeleteMessage
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(DeleteMessageModal)