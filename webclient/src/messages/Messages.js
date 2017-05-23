import React, { Component } from 'react';
import { Segment, Header, Divider, Icon, Container, TextArea, Menu, Image } from 'semantic-ui-react';
import MessageComments from './MessageComments'
import { find } from 'lodash';

class Messages extends Component {
    render() {
        let {
            currentChannel,
            users,
            newMessage,
            changeTextArea,
            postMessage
        } = this.props

        //Set public icon depending if private or not
        let privateiconname = "world"
        if (currentChannel.private) {
            privateiconname = "lock"
        }
        return (
            <Container fluid id='channel-container'>
                <Segment basic id='channel-container-left'>
                    <Segment basic padded id='channel-description'>
                        <Header as='h2' color='orange'>
                            <Icon name={privateiconname} className='private-icon' color='grey' />
                            <Header.Content>
                                {
                                    this.props.match.path.includes("@") ? (
                                        <div><Icon name='at' color='orange' fitted style={{ marginRight: 0 }} /> {this.props.match.params.username}</div>
                                    ) : (
                                            <div><Icon name='hashtag' color='orange' fitted style={{ marginRight: 0 }} /> {this.props.match.params.channelname}</div>
                                        )
                                }
                                <Header.Subheader>{currentChannel.description}</Header.Subheader>
                            </Header.Content>
                        </Header>
                        <Divider />
                    </Segment>
                    <Segment basic padded id='channel-messages'>
                        <MessageComments />
                    </Segment>
                    <Segment basic padded id='channel-textbox'>
                        <Divider />
                        <TextArea
                            className='textbox ui'
                            placeholder={`Message ${currentChannel.name}`}
                            autoHeight
                            value={newMessage}
                            onChange={(event) => changeTextArea(event)}
                            onKeyDown={event => postMessage(event)}
                        />
                    </Segment>
                </Segment>
                <Container fluid id='channel-container-right' as={Segment} basic>
                    <Container as={Segment} secondary basic fluid>
                        <Header as='h4' textAlign='center' color='orange'><strong>CHANNEL MEMBERS</strong></Header>
                        <Menu secondary pointing widths={8} icon='labeled'>
                            <Menu.Item name='users' color='orange' icon={{ name: "users", color: "grey" }} active />
                        </Menu>
                    </Container>
                    <Container>
                        {
                            currentChannel.members !== undefined && (
                                currentChannel.members.map(member => {
                                    let person = find(users, (u) => { return u.id === member })
                                    return person !== undefined && (
                                        <Menu.Item
                                            key={`key-${member}`}
                                            className='channel-item'
                                            style={{ padding: 5 }}
                                        >
                                            <Image src={person.photoURL} inline shape='rounded' spaced width={30} />
                                            {`${person.firstName} ${person.lastName} (@${person.userName})`}
                                        </Menu.Item>
                                    )
                                })
                            )
                        }
                    </Container>
                </Container>
            </Container>
        )
    }
}

export default Messages
