import React, { Component } from 'react'
import { Segment, Modal, Popup, Icon, Button, Form, Message} from 'semantic-ui-react'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEditMessage } from '../actions';

class EditMessageModal extends Component {
    state = {
        visible: false,
        message: this.props.message,
        body: this.props.message.body
    }

    hideModal = (e) => this.setState({ visible: false })

    showModal = (e) => this.setState({ visible: true })

    submit = (e) => {
        e.preventDefault()
        this.props.fetchEditMessage(this,this.state.message.id, this.state.body)
    }

    handleBody = (e) => this.setState({ body: e.target.value })

    render() {
        const { visible, body } = this.state
        const { fetching, fetchError } = this.props
        return (
            <Modal
                trigger={
                    <Popup
                        inverted
                        basic
                        trigger={<Icon name='pencil' link color='blue' onClick={this.showModal}/>}
                        content='Edit Message'
                    />
                }
                dimmer="inverted"
                open={visible}
                onClose={this.hideModal}
                closeOnEscape={true}
                closeOnRootNodeClick={false}
                closeIcon='close'
            >
                <Modal.Header as='h2'> <Icon name='pencil' color='blue' />Edit Message</Modal.Header>
                <Modal.Content>
                    <Segment basic padded>
                        <Form loading={fetching !== 0} warning={fetchError.length > 0} onSubmit={this.submit}>
                            <Form.Input type='text' value={body} onChange={this.handleBody}/>
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
        fetchEditMessage
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMessageModal)
