import React, { Component } from 'react';
import { Icon, Modal, Button, Label, Segment, List, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { find } from 'lodash';

import '../styles/modal.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createChannel, setCurrentChannel, createDMChannelname } from '../redux/actions';


class DMModal extends Component {
  state = {
    visible: false,
  }

  submit = (otherUser) => {
    const { currentUser, channels } = this.props;
    let channelname = createDMChannelname(otherUser.userName, currentUser.userName);
    if (find(channels, c => c.name === channelname) !== undefined) {
      this.setState({ visible: false })
      this.props.history.push(channelname)
    } else {
      this.props.createChannel(channelname, `Direct messages between you and ${otherUser.userName}`, true, [otherUser.id, currentUser.id])
        .then(resp => {
          this.setState({ visible: false })
          this.props.history.push(channelname)
        })
    }
  }

  hideModal = (e) => this.setState({ visible: false })

  showModal = (e) => this.setState({ visible: true })

  render() {
    const { visible } = this.state;
    const { fetching, fetchError, users } = this.props;
    return (
      <Modal
        trigger={
          <Button animated='vertical' fluid inverted onClick={this.showModal}>
            <Button.Content hidden>new direct message</Button.Content>
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
        <Modal.Header as='h2' className="modal-header">direct messages</Modal.Header>

        <Modal.Content className='modal-content-container'>
          <Segment basic padded className='dm-content'>
            <List celled animated relaxed>
              {users !== undefined && (users.map(u => {
                return <List.Item key={`key-usermodal-${u.id}`} onClick={() => this.submit(u)}>
                  <Image shape='rounded' src={u.photoURL} size='mini' />
                  <List.Content>
                    <List.Header>{`${u.userName}`}</List.Header>
                    {`${u.firstName} ${u.lastName}`}
                  </List.Content>
                  <Button className='submit-button' style={{ float: 'right' }} size='mini' icon='send outline'>
                  </Button>
                </List.Item>
              }))}
            </List>
          </Segment>
        </Modal.Content>
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
    channels: state.channels,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createChannel,
    setCurrentChannel
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DMModal));
