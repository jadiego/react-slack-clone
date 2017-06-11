import React, { Component } from 'react';
import { Segment, TextArea, Form, Header, Breadcrumb, Icon } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import { bindActionCreators } from 'redux';
import { fetchChannels, fetchChannelMessages } from '../redux/actions';
import { connect } from 'react-redux';

import LoginModal from './loginmodal'

import '../styles/messages.css';

class Messages extends Component {
  componentWillMount() {
    const { currentUser } = this.props;
    if(!isEmpty(currentUser)) {
      this.props.fetchChannels()
    }
  }

  render() {
    const { currentUser, currentChannel, match } = this.props;
    return (
      <Segment basic id='messages-container'>
        <Header as='h1' className='channel-name'>
          <Icon name='world' size='tiny'/>
          <Header.Content>
            <Breadcrumb divider='/' sections={[
              { key: 'messages', content: 'messages', link: false },
              { key: match.params.channelname, content: match.params.channelname, link: false },
            ]} size='big'/>
          </Header.Content>
        </Header>
        <div className='text-input-container'>
          <Form>
            {
              (localStorage.getItem("auth") === null) ? (
                <LoginModal />
              ) : (
                  <TextArea placeholder='chat' autoHeight />
                )
            }
          </Form>
        </div>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    currentChannel: state.currentChannel,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchChannelMessages,
    fetchChannels,
  }, dispatch)
}

export default connect()(Messages);
