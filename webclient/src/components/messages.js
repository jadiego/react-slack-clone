import React, { Component } from 'react';
import { Segment, TextArea, Form, Header, Breadcrumb, Icon, Image } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import LoginModal from './loginmodal';
import paragraph from '../assets/paragraph.png';

import { connect } from 'react-redux';

import '../styles/messages.css';

class Messages extends Component {
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
