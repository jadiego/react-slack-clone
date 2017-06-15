import React, { Component } from 'react';
import { Segment, Container, Item, Image, Breadcrumb, Divider, Label, Icon } from 'semantic-ui-react';
import { find } from 'lodash';
import moment from "moment";
import DeleteMessageModal from './deletemessagemodal';
import EditMessageModal from './editmessagemodal';

//import { bindActionCreators } from 'redux';
//import { checkSession, getUsers, getChannels, getSessionKey, getChannelMessages, setCurrentChannel } from './redux/actions';
import { connect } from 'react-redux';

const differenceBetweenTwoDates = (date1, date2, format, limit) => {
  return moment(date1).diff(moment(date2), format) >= limit;
}

class MessagesList extends Component {
  render() {
    const { messages, currentChannel, users, currentUser } = this.props;
    const myMessages = messages[currentChannel.id];

    return (
      <Container fluid className='items'>
        {myMessages !== undefined && (myMessages.map((m, i, a) => {
          let u = find(users, u => u.id === m.creatorid);
          return <Item.Group style={{ margin: 0 }} key={m.id}>
            {(a[i - 1] !== undefined) ? (
              (moment(m.createdAt).dayOfYear() !== moment(a[i - 1].createdAt).dayOfYear()) && <Divider horizontal className='comment-date'>{moment(m.createdAt).format('LL')}</Divider>
            ) : (
                <Divider horizontal className='comment-date'>{moment(m.createdAt).format('LL')}</Divider>
              )}
            <Item>
              {(a[i - 1] !== undefined) ? (
                (m.creatorid !== a[i - 1].creatorid
                  || differenceBetweenTwoDates(m.createdAt, a[i - 1].createdAt, 'minutes', 8)) ? (
                    <Item.Image size='mini' src={u.photoURL} />
                  ) : (
                    <div className='ui mini comment-time image'>{moment(m.createdAt).format('h:mm')}</div>
                  )) : (
                  <Item.Image size='mini' src={u.photoURL} />
                )}
              {(a[i - 1] !== undefined) ? (
                (m.creatorid !== a[i - 1].creatorid
                  || differenceBetweenTwoDates(m.createdAt, a[i - 1].createdAt, 'minutes', 8)) ? (
                    <Item.Content>
                      {(m.creatorid === currentUser.id) && (<Label floating><DeleteMessageModal message={m}/><EditMessageModal message={m}/></Label>)}
                      <Item.Header className='comment-username'>
                        <Breadcrumb>
                          <Breadcrumb.Section>{u.userName}</Breadcrumb.Section>
                          <Breadcrumb.Divider />
                          <Breadcrumb.Section>{moment(m.createdAt).format('LT')}</Breadcrumb.Section>
                        </Breadcrumb>
                      </Item.Header>
                      <Item.Description>
                        {m.body}
                      </Item.Description>
                    </Item.Content>
                  ) : (
                    <Item.Content>
                      {(m.creatorid === currentUser.id) && (<Label floating><DeleteMessageModal message={m}/><EditMessageModal message={m}/></Label>)}
                      <Item.Description>{m.body}</Item.Description>
                    </Item.Content>
                  )
              ) : (
                  <Item.Content>
                    {(m.creatorid === currentUser.id) && (<Label floating><DeleteMessageModal message={m}/><EditMessageModal message={m}/></Label>)}
                    <Item.Header className='comment-username'>
                      <Breadcrumb>
                        <Breadcrumb.Section>{u.userName}</Breadcrumb.Section>
                        <Breadcrumb.Divider />
                        <Breadcrumb.Section>{moment(m.createdAt).format('LT')}</Breadcrumb.Section>
                      </Breadcrumb>
                    </Item.Header>
                    <Item.Description>{m.body}</Item.Description>
                  </Item.Content>
                )}
            </Item>
          </Item.Group>
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