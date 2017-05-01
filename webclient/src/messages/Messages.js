import React, { Component } from 'react';
import { Segment, Header, Divider } from 'semantic-ui-react';

class Messages extends Component {
    render() {
        return (
            <Segment basic padded='very'>
                <Header as='h2'>Messages </Header>
                <Divider />
            </Segment>
        )
    }
}

export default Messages