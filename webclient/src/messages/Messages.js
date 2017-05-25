import React, { Component } from 'react';
import { Segment, Header, Divider, Icon, Container, TextArea, Menu, Image, Form, Input, Card, Button } from 'semantic-ui-react';
import MessageComments from './MessageComments';
import { find } from 'lodash';
import moment from "moment";
import EditChannelModal from '../components/EditChannelModal';
import DeleteChannelModal from '../components/DeleteChannelModal';

class Messages extends Component {
    render() {
        let {
            currentChannel,
            currentUser,
            users,
            newMessage,
            changeTextArea,
            postMessage,
            activeMenu,
            handleItemClick,
            name,
            description,
            handleDescription,
            handleName
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
                        <Header as='h4' textAlign='center' color='orange'><strong>CHANNEL INFORMATION</strong></Header>
                        <Menu attached='top' icon tabular>
                            <Menu.Item name='users' active={activeMenu === 'users'} onClick={handleItemClick}>
                                <Icon name='users' />
                            </Menu.Item>

                            <Menu.Item name='info' active={activeMenu === 'info'} onClick={handleItemClick}>
                                <Icon name='info' />
                            </Menu.Item>

                        </Menu>
                    </Container>
                    <Container>
                        {
                            activeMenu === "users" ? (
                                <div>
                                    <Header as='h5' textAlign='center' color='orange'><strong>MEMBERS</strong></Header>
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
                                </div>
                            ) : (
                                    <div>
                                        <Header as='h5' textAlign='center' color='orange'><strong>DETAILS</strong></Header>
                                        <Segment padded basic>
                                            <Divider horizontal>
                                                <Icon name='hashtag' bordered circular color='orange' />
                                            </Divider>
                                            <Card centered style={{ textAlign: 'center' }}>
                                                <Card.Content>
                                                    <Card.Header>
                                                        {currentChannel.name}
                                                    </Card.Header>
                                                </Card.Content>
                                                <Card.Content>
                                                    <Card.Description>
                                                        {currentChannel.description}
                                                    </Card.Description>
                                                    <Card.Meta>
                                                        <strong>Created: </strong>
                                                        {moment(currentChannel.createdAt).format("LL")}
                                                    </Card.Meta>
                                                </Card.Content>
                                                {
                                                    currentChannel.creatorid === currentUser.id && (
                                                        <Card.Content extra>
                                                            <div className='ui two buttons'>
                                                                <DeleteChannelModal channel={currentChannel}/>
                                                                <EditChannelModal channel={currentChannel}/>
                                                            </div>
                                                        </Card.Content>
                                                    )
                                                }
                                            </Card>
                                        </Segment>
                                    </div>
                                )
                        }
                    </Container>
                </Container>
            </Container>
        )
    }
}

export default Messages
