import React, { Component } from 'react'
import { Menu, Container, Form, Message, Card, Icon, Image } from 'semantic-ui-react'

//http://104.131.146.195/v1/summary?url=http://ogp.me
const baseURL = "http://104.131.146.195/v1/summary?url="

class TopNavbar extends Component {
    render() {
        return (
            <Menu fixed='top'>
                <Container>
                    <Menu.Item header>
                        OGPSearch
						</Menu.Item>
                </Container>
            </Menu>
        );
    }
}

//OGPCard renders a card with shows ogp properties form a url
//expects ogp properties
class OGPCard extends Component {
    constructor(props) {
        super(props);
        this.state = { hidden: this.props.hidden }
    }


    render() {
        let ogp = this.props.ogp

        return (
            <Card centered>
                <Image src={ogp.image} />
                <Card.Content>
                    <Card.Header>
                        {ogp.title}
                    </Card.Header>
                    <Card.Meta>
                        <span >
                            {ogp.type}
                        </span>
                    </Card.Meta>
                    <Card.Description>
                        {ogp.description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <a href={ogp.url}>
                        <Icon name='browser' />
                        {ogp.url}
                    </a>
                </Card.Content>
            </Card>
        )

    }
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            err: false,
            errmsg: '',
            result: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    //called whenever user types into input control. 
    //updates the query state property
    handleChange(e) {
        this.setState({ ...this.state, query: e.target.value });
    }

    //called when the user submits the form (clicks or hits submit)
    //will query API and call setState with the results
    handleSubmit(e) {
        e.preventDefault()
        fetch(baseURL + this.state.query)
            .then(response => response.json())
            .then(data => {
                this.setState({ ...this.state, result: data, err: false })
            })
            .catch(err => {
                this.setState({ ...this.state, err: true, errmsg: err })
            });
    }


    render() {
        return (
            <div>
                <TopNavbar />
                <section id="search-container">
                    <Form id='search-form' error={this.state.err} onSubmit={this.handleSubmit}>
                        <p>Search for a <strong>web page</strong> here! It will bring back a <strong>summary</strong> of the webpage.</p>

                        <Form.Input placeholder='http://ogp.me' onChange={this.handleChange} value={this.state.value}
                            fluid size='tiny' action={{ icon: 'search' }} />

                        <Message error={this.state.err} hidden={!this.state.err}
                            header='Oops try again!'
                            content={this.state.errmsg.message} />
                    </Form>
                </section>
                <section id="results-container" >
                    <OGPCard ogp={this.state.result} hidden={!this.state.err} />
                </section>
            </div>
        )
    }
}