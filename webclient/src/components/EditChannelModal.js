import React, { Component } from 'react'
import { Segment, Modal, Popup, Icon, Button, Form, Message} from 'semantic-ui-react'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEditChannel } from '../actions';

class EditChannelModal extends Component {
    state = {
        visible: false,
        channel: this.props.channel,
        name: this.props.channel.name,
        description: this.props.channel.description
    }

    hideModal = (e) => this.setState({ visible: false })

    showModal = (e) => this.setState({ visible: true })

    submit = (e) => {
        e.preventDefault()
        this.props.fetchEditChannel(this,this.state.channel.id, this.state.name, this.state.description)
    }

    handleName = (e) => this.setState({ name: e.target.value })

    handleDescription = (e) => this.setState({ description: e.target.value })

    render() {
        const { visible, name, description } = this.state
        const { fetching, fetchError } = this.props
        return (
            <Modal
                trigger={
                    <Button basic color='green' onClick={this.showModal}>Update</Button>
                }
                dimmer="inverted"
                open={visible}
                onClose={this.hideModal}
                closeOnEscape={true}
                closeOnRootNodeClick={false}
                closeIcon='close'
            >
                <Modal.Header as='h2'> Edit Channel</Modal.Header>
                <Modal.Content>
                    <Segment basic padded>
                        <Form loading={fetching !== 0} warning={fetchError.length > 0} onSubmit={this.submit}>
                            <Form.Input label='Name' type='text' value={name} onChange={this.handleName}/>
                            <Form.Input label='Description' type='text' value={description} onChange={this.handleDescription}/>
                            <Message warning>{fetchError}</Message>
                        </Form>
                    </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='blue' onClick={this.hideModal}>
                        Cancel
                        </Button>
                    <Button inverted color='red' onClick={this.submit}>
                        Save Changes
                        <Icon name='long arrow right' /> 
                        </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        fetching: state.fetching,
        fetchError: state.fetchError
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchEditChannel
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditChannelModal)
