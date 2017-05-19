import React, { Component } from 'react';
import { Segment, Header, Divider, Icon, Container, TextArea, Feed, Menu, Image, Dimmer, Loader } from 'semantic-ui-react';
import MessageComments from './MessageComments'
import _, { find } from 'lodash';

class Messages extends Component {
    render() {
        console.log(this.props)
        let {
            fetching,
            currentUser,
            currentChannel,
            users,
            newMessage,
            channels,
        } = this.props

        //Set public icon depending if private or not
        let privateiconname = "world"
        if (currentChannel.private) {
            privateiconname = "lock"
        }
        return (
            <Container fluid id='channel-container'>
                <Dimmer active={fetching !== 0} inverted>
                    <Loader inverted content='Loading' />
                </Dimmer>
                <Segment basic id='channel-container-left'>
                    <Segment basic padded id='channel-description'>
                        <Header as='h2' color='orange'>
                            <Icon name={privateiconname} className='private-icon' color='grey' />
                            <Header.Content>
                                {currentChannel.name}
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
                            currentChannel.members != undefined && (
                                currentChannel.members.map(member => {
                                    let person = _.find(users, function(u) { return u.id === member; });
                                    return <Menu.Item
                                        key={`key-${member}`}
                                        className='channel-item'
                                    >
                                        <Image src={person.photoURL} inline shape='rounded' spaced width={30} />
                                        {`${person.firstName} ${person.lastName} (@${person.userName})`}
                                    </Menu.Item>
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