import React, { Component } from 'react';
import { Segment, Container, Item, Image, Breadcrumb } from 'semantic-ui-react';
import { find } from 'lodash';
import moment from "moment";

//import { bindActionCreators } from 'redux';
//import { checkSession, getUsers, getChannels, getSessionKey, getChannelMessages, setCurrentChannel } from './redux/actions';
import { connect } from 'react-redux';

const differenceBetweenTwoDates = (date1, date2, format, limit) => {
  return moment(date1).diff(moment(date2), format) >= limit;
}

class MessagesList extends Component {
  render() {
    const { messages, currentChannel, users } = this.props;
    const myMessages = messages[currentChannel.id];
    let prevDate = {};
    let prevUser = '';
    let group = 0;
    // if (myMessages !== undefined) {
    //   myMessages.map((m, i, a) => {
    //     if (m.creatorid !== prevUser) {
    //       prevUser = m.creatorid;
    //       group++;
    //     }
    //     m.group = group;
    //     if (a[i - 1] !== undefined) {
    //       if (moment(m.createdAt).diff(moment(a[i - 1].createdAt), 'minutes') > 10 ||
    //         moment(m.createdAt).diff(moment(a[i - 1].createdAt), 'days') >= 1) {
    //         group++
    //         m.group = group;
    //       }
    //     }
    //     return m;
    //   });
    // }
    return (
      <Container fluid className='items'>
        {myMessages !== undefined && (myMessages.map((m, i, a) => {
          let u = find(users, u => u.id === m.creatorid);
          return <Item key={m.id}>
            {(a[i - 1] !== undefined) ? (
              differenceBetweenTwoDates(m.createdAt, a[i - 1].createdAt, 'days', 1) && <div>{moment(m.createdAt).format('LL')}</div>
            ) : (
                <div>{moment(m.createdAt).format('LL')}</div>
              )}
            {(a[i - 1] !== undefined) ? (
              (m.creatorid !== a[i - 1].creatorid
                || differenceBetweenTwoDates(m.createdAt, a[i - 1].createdAt, 'minutes', 8)
                || differenceBetweenTwoDates(m.createdAt, a[i - 1].createdAt, 'days', 1)) ? (
                  <Item.Image size='mini' src={u.photoURL} />
                ) : (
                  <div className='ui mini image'></div>
                )) : (
                <Item.Image size='mini' src={u.photoURL} />
              )}
            {(a[i - 1] !== undefined) ? (
              (m.creatorid !== a[i - 1].creatorid
                || differenceBetweenTwoDates(m.createdAt, a[i - 1].createdAt, 'minutes', 8)
                || differenceBetweenTwoDates(m.createdAt, a[i - 1].createdAt, 'days', 1)) ? (
                  <Item.Content>
                    <Item.Header className='comment-username'>
                      <Breadcrumb>
                        <Breadcrumb.Section>{u.userName}</Breadcrumb.Section>
                        <Breadcrumb.Divider />
                        <Breadcrumb.Section>{moment(m.createdAt).format('LT')}</Breadcrumb.Section>
                      </Breadcrumb>
                    </Item.Header>
                    <Item.Description>{m.body}</Item.Description>
                  </Item.Content>
                ) : (
                  <Item.Content>
                    <Item.Description>{m.body}</Item.Description>
                  </Item.Content>
                )
            ) : (
                <Item.Content>
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