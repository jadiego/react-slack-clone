import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import { apiRoot, handleResponse } from '../actions'

class OGPCard extends Component {
    state = {
        ogp: [],
    }

    componentWillMount() {
        for (let i = 0; i < this.props.links.length; i++) {
            fetch(`${apiRoot}summary?url=${this.props.links[i].href}`, {
                mode: "cors",
            })
                .then(handleResponse)
                .then(data => {
                    //returns a new array with new value appended
                    this.setState({ ogp: this.state.ogp.concat([data]) })
                })
                .catch(error => {
                    console.log("not a link, rendering by mistake", error);
                })
        }
    }

    render() {

        let { ogp } = this.state
        let { body } = this.props


        return (
            <div>
                {body}
                {
                    ogp.length !== 0 && (
                        ogp.map((link, i) => {
                            return (link.description === undefined) ? (
                                null
                            ) : (
                                    <Card fluid color='orange' key={`key-${i}`}>
                                        <Card.Content>
                                            <Image src={link.image} href={link.url} floated="right" size="small" />
                                            <Card.Header>
                                                {link.title}
                                            </Card.Header>
                                            <Card.Meta>
                                                {link.site_name}
                                            </Card.Meta>
                                            <div>
                                                {link.description}
                                            </div>
                                        </Card.Content>
                                    </Card>
                                )
                        })
                    )
                }
            </div>
        )
    }
}

export default OGPCard