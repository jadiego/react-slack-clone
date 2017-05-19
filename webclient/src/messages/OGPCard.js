import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import { apiRoot, handleResponse, handleJSONResponse, handleTextResponse } from '../actions'

class OGPCard extends Component {
    state = {
        data: {}
    }

    componentWillMount() {
        fetch(`${apiRoot}summary?url=${this.props.link}`, {
            mode: "cors",
        })
            .then(handleResponse)
            .then(data => {
                this.setState({ data })
            })
            .catch(error => {
                console.log("not a link, rendering by mistake", error);
            })
    }

    render() {

        let { data } = this.state
        if (data === undefined) {
            return null
        }

        return <Card fluid color='orange'>
            <Card.Content>
                <Image src={data.image} href={data.url} floated="right" size="small" />
                <Card.Header>
                    {data.title}
                </Card.Header>
                <Card.Meta>
                    {data.site_name}
                </Card.Meta>
                <div>
                    {data.description}
                </div>
            </Card.Content>
        </Card>
    }
}

export default OGPCard