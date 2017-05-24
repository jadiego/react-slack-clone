import React, { Component } from 'react';
import { Feed, Image, Icon, Popup } from 'semantic-ui-react';
import moment from "moment";
import { find } from 'lodash';
import * as linkify from 'linkifyjs';

import OGPCard from './OGPCard';
import DeleteMessageModal from './DeleteMessageModal';
import EditMessageModal from './EditMessageModal';

import { connect } from 'react-redux';

class MessageComments extends Component {
    render() {
        let {
            messages,
            users,
            currentChannel,
            currentUser
        } = this.props

        messages = messages[currentChannel.id]
        return (
            <Feed>
                {messages !== undefined && (
                    messages.map(message => {
                        let person = find(users, function (u) { return u.id === message.creatorid; });
                        return <Feed.Event className='message-item' key={`key-${message.id}${Math.random()}`}>
                            <Feed.Label><Image src={person.photoURL} /></Feed.Label>
                            <Feed.Content>
                                <Feed.Summary>
                                    {`${person.firstName} ${person.lastName}`}
                                    <Feed.Date>{moment(message.createdAt).fromNow()}</Feed.Date>
                                    {
                                        message.creatorid === currentUser.id && (
                                            <div className='edit-comment-container'>
                                                <EditMessageModal message={message} />
                                                <DeleteMessageModal message={message} />
                                            </div>
                                        )
                                    }
                                    <Feed.Date className='comment-date-right'>{moment(message.createdAt).format("LLL")}</Feed.Date>
                                </Feed.Summary>
                                {
                                    <div>
                                        {message.body}
                                        {(message.createdAt !== message.editedAt) && (
                                                <Popup inverted content={moment(message.editedAt).format("LLL")} trigger={
                                                    <span style={{ fontSize: '11px', color: 'grey' }}> (edited)</span>
                                                } />
                                            )}
                                        {(linkify.find(message.body).length !== 0) && (
                                                <OGPCard links={linkify.find(message.body)} />
                                            )}
                                    </div>
                                }
                            </Feed.Content>
                        </Feed.Event>
                    }
                    )
                )}
            </Feed>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        users: state.users,
        currentChannel: state.currentChannel,
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(MessageComments)