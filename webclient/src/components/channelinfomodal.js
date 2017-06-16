import React, { Component } from 'react';
import { Segment, Modal, Icon, Button, Form, Label, Header, Message, Card, Divider, Checkbox, Popup, List, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { find } from 'lodash';

import '../styles/modal.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editChannel, deleteChannel, setCurrentChannel } from '../redux/actions';


class ChannelInfoModal extends Component {
  state = {
    visible: false,
    name: "",
    description: "",
    checked: false,
  }

  submit = (e) => {
    e.preventDefault()
    const { name, description, members } = this.state;
    this.props.editChannel(name, description)
      .then(resp => {
        this.props.history.push(`/messages/${resp.data.name}`)
      })
  }

  delete = (e) => {
    e.preventDefault()
    this.props.deleteChannel()
      .then(resp => {
        this.props.history.push('/messages/general')
      })
  }

  hideModal = (e) => this.setState({ visible: false })

  showModal = (e) => this.setState({ visible: true })

  toggle = (e) => this.setState({ checked: !this.state.checked })

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value })

  render() {
    const { visible, name, description, checked } = this.state
    const { fetching, fetchError, currentChannel, currentUser, users } = this.props;
    return (
      <Modal
        trigger={<Icon name='info circle' className='channel-settings-icon' onClick={this.showModal} />}
        dimmer="inverted"
        open={visible}
        onClose={this.hideModal}
        closeOnEscape={true}
        closeOnRootNodeClick={false}
        closeIcon={<Label color='grey' floating style={{ cursor: 'pointer' }}>X</Label>}
        size='small'>
        <Modal.Header as='h2' className="modal-header">channel information</Modal.Header>

        <Modal.Content className='modal-content-container'>
          <Segment basic padded className='channel-info-content'>
            <Divider horizontal><Icon circular name='info' /></Divider>
            <Card fluid>
              <Card.Content header={currentChannel.name} />
              <Card.Content description={currentChannel.description} />
              <Card.Content extra>
                <Icon name='user' />
                {currentChannel.members.length}
                <Popup
                  trigger={<span className='members-popup'> members</span>}
                  content={
                    <List celled relaxed>
                      {currentChannel.members.map(uid => {
                        let u = find(users, user => user.id === uid);
                        return <List.Item key={`key-usermodal-${u.id}`} onClick={() => this.submit(u)}>
                          <Image shape='rounded' src={u.photoURL} size='mini' />
                          <List.Content>
                            <List.Header>{`${u.userName}`}</List.Header>
                            {`${u.firstName} ${u.lastName}`}
                          </List.Content>
                        </List.Item>
                      })}
                    </List>
                  }
                  on='click'
                  position='bottom center'
                />
              </Card.Content>
            </Card>
            {(currentChannel.creatorid === currentUser.id) && (
              <div>
                <Divider horizontal><Icon circular name='pencil' /></Divider>
                <Segment padded>
                  <Form loading={fetching.count !== 0} warning={fetchError.length > 0 && fetching.fetch === 'edit channel'} onSubmit={this.submit}>
                    <Form.Input type='text' placeholder='# e.g. announcements' label='Name' value={name} onChange={this.handleChange} name='name' />
                    <Form.Input type='text' placeholder='What is this channel about?' value={description} label='Description (optional)' name='description' onChange={this.handleChange} />
                    <Button type='submit' fluid className='submit-button' style={{ display: 'none' }}>submit</Button>
                    <Message warning>{fetchError}</Message>
                  </Form>
                </Segment>
                <Divider horizontal><Icon circular name='trash' /></Divider>
                <Segment padded>
                  <Form.Field>
                    <Header.Subheader>This action <strong>CANNOT</strong> be undone. Once you delete a repository, there is no going back. This will permanently delete all channel contents, including all messages. Please be certain. Check the checkbox to confirm.</Header.Subheader>
                    <Checkbox style={{ color: 'grey', margin: '10px' }} checked={checked} onChange={this.toggle} label={<label>I understand the consequences, delete this channel</label>} />
                    <Button className='warning-button' onClick={this.delete} fluid disabled={!checked}>
                      delete
                    </Button>
                  </Form.Field>
                </Segment>
              </div>
            )}
          </Segment>
        </Modal.Content>

        <Modal.Actions>
          <Button className='exit-button' onClick={this.hideModal}>
            exit
          </Button>
          {(currentChannel.creatorid === currentUser.id) && (
            <Button className='submit-button' onClick={this.submit}>
              save
            </Button>
          )}
          <div style={{ clear: 'both' }}></div>
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.fetching,
    fetchError: state.fetchError,
    currentUser: state.currentUser,
    currentChannel: state.currentChannel,
    users: state.users,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    editChannel,
    deleteChannel
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChannelInfoModal));
