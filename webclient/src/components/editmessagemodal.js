import React, { Component } from 'react';
import { Segment, Modal, Label, Icon, Button, TextArea, Form } from 'semantic-ui-react';

import '../styles/modal.css';

import { bindActionCreators } from 'redux';
import { editMessage } from '../redux/actions';
import { connect } from 'react-redux';

class EditMessageModal extends Component {
  state = {
    visible: false,
  }

  componentWillMount() {
    this.state = { ...this.props.message }
  }

  submit = (e) => {
    e.preventDefault();
    this.props.editMessage(this.state.body, this.props.message)
      .then(resp => {
        if (resp.response === undefined) {
          this.setState({ visible: false })
        }
      })
  }

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value })

  hideModal = (e) => this.setState({ visible: false })

  showModal = (e) => this.setState({ visible: true })

  render() {
    const { fetching, fetchError, message } = this.props;
    const { visible, body } = this.state;
    return (
      <Modal
        trigger={<Icon name='pencil' onClick={this.showModal} />}
        dimmer="inverted"
        open={visible}
        onClose={this.hideModal}
        closeOnEscape={true}
        closeOnRootNodeClick={false}
        closeIcon={<Label color='grey' floating style={{ cursor: 'pointer' }}>X</Label>}
        size='small'>
        <Modal.Header as='h2' className="modal-header">edit message</Modal.Header>
        <Modal.Content className='modal-content-container'>
          <Segment basic padded>
            <Form>
              <TextArea value={body} autoHeight name='body' onChange={this.handleChange} style={{ maxHeight: '150px' }} />
            </Form>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button className='exit-button' onClick={this.hideModal} disabled={fetching.count !== 0}>
            exit
            </Button>
          <Button className='submit-button' onClick={this.submit} disabled={fetching.count !== 0}>
            update
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
    editMessage
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMessageModal);
