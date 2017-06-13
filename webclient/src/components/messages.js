import React, { Component } from 'react';
import { Segment, TextArea, Form, Header, Breadcrumb, Icon, Image } from 'semantic-ui-react';
import { isEmpty, isEqual, find } from 'lodash';
import LoginModal from './loginmodal';
import paragraph from '../assets/paragraph.png';

import { connect } from 'react-redux';

import '../styles/messages.css';

class Messages extends Component {
  shouldComponentUpdate(nextProps) {
    console.log(this.props, nextProps)
    // if (this.props.match.params.channelid === nextProps.match.params.channelid && !isEmpty(this.props.currentUser)) {
    //   return false
    // }
    return !isEqual(this.props, nextProps)
  }

  render() {
    const { currentUser, currentChannel } = this.props;
    return (
      <Segment basic id='messages-container'>
        <Header as='h1' className='channel-name'>
          <Icon name='world' size='tiny' />
          <Header.Content>
            <Breadcrumb size='big'>
              <Breadcrumb.Section>messages</Breadcrumb.Section>
              <Breadcrumb.Divider />
              {(!isEmpty(currentChannel)) && currentChannel.name.includes(':') ? (
                <span>
                  <Breadcrumb.Section>dm</Breadcrumb.Section>
                  <Breadcrumb.Divider />
                  <Breadcrumb.Section>{find(currentChannel.name.split(':'), n => n !== currentUser.userName)}</Breadcrumb.Section>
                </span>
              ) : (
                  <Breadcrumb.Section>{currentChannel.name}</Breadcrumb.Section>
                )}
            </Breadcrumb>
          </Header.Content>
        </Header>
        <Segment basic>
          {
            (isEmpty(currentUser)) && (
              <div>
                <Image src={paragraph} />
                <br />
                <Image src={paragraph} />
              </div>
            )
          }
        </Segment>
        <div className='text-input-container'>
          <Form>
            {
              (isEmpty(currentUser)) ? (
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

export default connect(mapStateToProps)(Messages);
