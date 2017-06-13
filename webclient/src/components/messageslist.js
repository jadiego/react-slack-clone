import React, { Component } from 'react';
import { Segment, Container } from 'semantic-ui-react';

//import { bindActionCreators } from 'redux';
//import { checkSession, getUsers, getChannels, getSessionKey, getChannelMessages, setCurrentChannel } from './redux/actions';
import { connect } from 'react-redux';

class MessagesList extends Component {
  render() {
    const { messages, currentChannel } = this.props;
    const myMessages = messages[currentChannel.id];
    return (
      <Container fluid>
        {myMessages !== undefined && (myMessages.map(m => {
          return <div key={m.id}>{m.body}</div>
        }))}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        currentUser: state.currentUser,
        currentChannel: state.currentChannel,
        users: state.users,
    }
}

export default connect(mapStateToProps)(MessagesList);