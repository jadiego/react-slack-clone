import React, { Component } from 'react';
import { Feed, Image } from 'semantic-ui-react';
import moment from "moment";
import _, { find } from 'lodash';

import { connect } from 'react-redux';

class MessageComments extends Component {
    render() {
        let {
            messages,
            users,
            currentChannel
        } = this.props

        messages = messages[currentChannel.id]

        return (
            <Feed>
                {messages !== undefined && (
                    messages.map(message => {
                        let person = _.find(users, function (u) { return u.id === message.creatorid; });
                        return <Feed.Event className='message-item' key={`key-${message.id}`}>
                            <Feed.Label><Image src={person.photoURL} /></Feed.Label>
                            <Feed.Content>
                                <Feed.Summary>
                                    {`${person.firstName} ${person.lastName}`}
                                    <Feed.Date>{moment(message.createdAt).fromNow()}</Feed.Date>
                                    <Feed.Date className='comment-date-right'>{moment(message.createdAt).format("LLL")}</Feed.Date>
                                </Feed.Summary>
                                <div className="text">
                                    {message.body}
                                </div>
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
        currentChannel: state.currentChannel
    }
}

export default connect(mapStateToProps)(MessageComments)