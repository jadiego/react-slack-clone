import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Segment, Form, Header, Breadcrumb, Icon, Image, Container } from 'semantic-ui-react';
import { isEmpty, isEqual, find } from 'lodash';
import LoginModal from './loginmodal';
import MessagesList from './messageslist';
import NewMessageForm from './newmessageform';
import paragraph from '../assets/paragraph.png';

import { bindActionCreators } from 'redux';
import { setCurrentChannel, getChannelMessages, getChannelFromURL } from '../redux/actions';
import { connect } from 'react-redux';

import '../styles/messages.css';

class Messages extends Component {
  componentWillUpdate(nextProps) {
    if (getChannelFromURL(this.props) !== getChannelFromURL(nextProps)) {
      let channel = this.props.setCurrentChannel(getChannelFromURL(nextProps))
      this.props.getChannelMessages()
        .then(resp => {
          const node = ReactDOM.findDOMNode(this.messagesEnd);
          node.scrollIntoView({ behavior: "smooth" });
        })
    }
  }

  render() {
    const { currentUser, currentChannel } = this.props;
    return (
      <div id='messages-container'>
        <Header as='h1' className='channel-name'>
          {currentChannel.private ? (
            <Icon name='lock' size='tiny' />
          ) : (
              <Icon name='world' size='tiny' />
            )}
          <Header.Content>
            <Breadcrumb size='big'>
              <Breadcrumb.Section>messages</Breadcrumb.Section>
              <Breadcrumb.Divider />
              {(!isEmpty(currentChannel)) && currentChannel.name.includes(':') ? (
                <span>
                  <Breadcrumb.Section>dm</Breadcrumb.Section>
                  <Breadcrumb.Divider />
                  <Breadcrumb.Section>{find(currentChannel.name.split(':'), n => n !== currentUser.userName || currentUser.userName)}</Breadcrumb.Section>
                </span>
              ) : (
                  <Breadcrumb.Section>{currentChannel.name}</Breadcrumb.Section>
                )}
            </Breadcrumb>
            <Header.Subheader>
              {(!isEmpty(currentChannel)) && (
                <span>
                  <Icon name='user'/> {currentChannel.members.length} / {currentChannel.description}
                </span>
              )}
            </Header.Subheader>
          </Header.Content>
        </Header>
        <div id='column-messages-container'>
          <div className='text-input-container'>
            <Form>
              {(isEmpty(currentUser)) ? (
                <LoginModal />
              ) : (
                  <NewMessageForm messagesEndRef={this.messagesEnd} />
                )}
            </Form>
          </div>
          <Container fluid className='messages-list-container'>
            {(isEmpty(currentUser)) ? (
              <div>
                <Image src={paragraph} />
                <br />
                <Image src={paragraph} />
              </div>
            ) : (
                <div>
                  <MessagesList />
                  <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}></div>
                </div>
              )}
          </Container>
        </div>
      </div>
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
    getChannelMessages,
    setCurrentChannel,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
