import React, { Component } from 'react';
import { Segment, Modal, Label, Icon, Button, TextArea, Form } from 'semantic-ui-react';

import '../styles/modal.css';

import { bindActionCreators } from 'redux';
import { deleteMessage } from '../redux/actions';
import { connect } from 'react-redux';

class DeleteMessageModal extends Component {
  state = {
    visible: false,
  }

  submit = (e) => {
    e.preventDefault();
    this.props.deleteMessage(this.props.message)
  }

  hideModal = (e) => this.setState({ visible: false })

  showModal = (e) => this.setState({ visible: true })

  render() {
    const { visible } = this.state;
    const { fetching, fetchError, message } = this.props;
    return (
      <Modal
        trigger={<Icon name='trash' onClick={this.showModal}/>}
        dimmer="inverted"
        open={visible}
        onClose={this.hideModal}
        closeOnEscape={true}
        closeOnRootNodeClick={false}
        closeIcon={<Label color='grey' floating style={{ cursor: 'pointer' }}>X</Label>}
        size='small'>
          <Modal.Header as='h2' className="modal-header">delete message</Modal.Header>
          <Modal.Content className='modal-content-container'>
            <Segment basic padded>
              <Form>
                <TextArea value={message.body} disabled autoHeight/>
              </Form>
              <br />
              Are you sure you want to delete this message? This action cannot be undone.
            </Segment>
          </Modal.Content>
        <Modal.Actions>
          <Button className='exit-button' onClick={this.hideModal} disabled={fetching.count !== 0}>
            exit
            </Button>
          <Button className='warning-button' onClick={this.submit} disabled={fetching.count !== 0}>
            delete
            </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.fetching,
    fetchError: state.fetchError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    deleteMessage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMessageModal);
