import React, { Component } from 'react';
import { Segment, Modal, Icon, Button, Checkbox, Form, Label, Header, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { find } from 'lodash';

import '../styles/modal.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createChannel } from '../redux/actions';


class NewChannelModal extends Component {
  state = {
    visible: false,
    checked: false,
    name: "",
    description: "",
    members: [],
  }

  componentWillMount() {
    const { currentUser } = this.props;
    this.setState({ members: [currentUser.id] })
  }

  submit = (e) => {
    e.preventDefault()
    const { name, description, checked, members } = this.state;
    this.props.createChannel(name, description, checked, members)
      .then(resp => {
        if (resp.response === undefined) {
          this.setState({ visible: false, checked: false, name: "", description: "", members: [] })
          this.props.history.push(name)
        }
      })
  }

  hideModal = (e) => this.setState({ visible: false })

  showModal = (e) => this.setState({ visible: true })

  togglePrivacy = (e) => this.setState({ checked: !this.state.checked })

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value })

  render() {
    const { visible, checked, name, description, members } = this.state
    const { fetching, fetchError, users } = this.props;
    return (
      <Modal
        trigger={
          <Button animated='vertical' fluid inverted onClick={this.showModal}>
            <Button.Content hidden>create new channel</Button.Content>
            <Button.Content visible>
              <Icon name='plus' />
            </Button.Content>
          </Button>
        }
        dimmer="inverted"
        open={visible}
        onClose={this.hideModal}
        closeOnEscape={true}
        closeOnRootNodeClick={false}
        closeIcon={<Label color='grey' floating style={{ cursor: 'pointer' }}>X</Label>}
        size='small'>
        <Modal.Header as='h2' className="modal-header">create new channel</Modal.Header>

        <Modal.Content className='modal-content-container'>
          <Segment basic padded className='new-channel-content'>
            <Form loading={fetching.count !== 0} warning={fetchError.length > 0 && fetching.fetch === 'create new channel'} onSubmit={this.submit}>
              <Form.Field>
                <label>
                  Channel Privacy Type: {checked ? ("Private") : ("Public")}
                </label>
                <Checkbox toggle checked={checked} onChange={this.togglePrivacy} />
                <Header.Subheader style={{ color: 'grey', fontSize: '12px' }}>Public Channels can be joined by anyone.</Header.Subheader>
              </Form.Field>
              <Form.Input type='text' placeholder='# e.g. announcements' label='Name' value={name} onChange={this.handleChange} name='name' />
              <Form.Input type='text' placeholder='What is this channel about?' value={description} label='Description (optional)' name='description' onChange={this.handleChange} />
              <Button type='submit' fluid className='submit-button' style={{ display: 'none' }}>submit</Button>
              <Message warning>{fetchError}</Message>
            </Form>
          </Segment>
        </Modal.Content>

        <Modal.Actions>
          <Button className='exit-button' onClick={this.hideModal}>
            cancel
            </Button>
          <Button className='submit-button' onClick={this.submit}>
            create
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
    users: state.users,
    currentUser: state.currentUser,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createChannel
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewChannelModal));
