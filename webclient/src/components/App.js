import React, { Component } from 'react'
import { Menu, Input, Container, Message, Card } from 'semantic-ui-react'


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


class OGPCard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (!this.props.show) {
			return null
		} else {
			return (
				<Card
					image={this.props.img}
					header={this.props.title}
					description={this.props.description}
					href={this.props.url}
					>

				</Card>
			)
		}
	}
}

class InvalidURLWarningMessage extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Message warning>
				<Message.Header>You must use a valid URL!</Message.Header>
				<p>{this.props.errmessage}</p>
			</Message>
		)
	}
}

class SearchForm extends Component {


	constructor(props) {
		super(props);

		// This binding is necessary to make `this` work in the callback
		this.handleSearch = this.handleSearch.bind(this);
	}

	// method to call when search button is clicked
	handleSearch = (e) => {
		e.preventDefault();
		let url = document.querySelector("#url input").value;
		console.log("Searching:", url)
		// call on API to get Opengraph properties
		fetch("http://104.131.146.195/v1/summary?url=" + url)
			.then(function (resp) {
				return resp.json()
			})
			.then(function (data) {
				console.log("Results :", data)
				let warningcontainer = document.querySelector("#results-list");
				warningcontainer.innerHTML = "";
				// When the server responds with a JSON of the OGP properties
				// render the summary data to the page. Atleast renders the
				// image, title, and description property.
				// Handles missing properties gracefully.
				// Communicates back the error if it comes across one.
				
			})
			.catch(function (err) {
				console.log(err)
				let warningcontainer = document.querySelector("#results-list");
				warningcontainer.innerHTML = "";
				let warningmsg = document.createElement("div")
				warningmsg.className = "warningmsg"
				let a = document.createElement("strong");
				a.innerText = "Woops! Try another link!"
				let b = document.createElement("p")
				b.innerText = err;
				warningmsg.appendChild(a);
				warningmsg.appendChild(b);
				warningcontainer.appendChild(warningmsg);
			})
	}

	render() {
		return (
			<div id='search-input'>
				<p>Search for a <strong>web page</strong> here! It will bring back a <strong>summary</strong> of the webpage.</p>

				<Input id='url' as='form' onSubmit={this.handleSearch} fluid size='tiny' action={{ icon: 'search', id: "searchbtn", onClick: this.handleSearch }} placeholder='http://ogp.me/' />
			</div>
		);
	}
}

class OGPCardControl extends Component {
	constructor(props) {
		super(props);
		this.state = { gotResults: false }
	}

	render() {
		const didGetResults = this.state.gotResults;

		if (didGetResults) {
			return (
				<Card
					image={this.props.img}
					header={this.props.title}
					description={this.props.description}
					href={this.props.url}
					>

				</Card>
			)
		} else {
			return null
		}
	}
}


class App extends Component {
	render() {
		return (
			<div>
				<TopNavbar />
				<section id="search-container">
					<SearchForm></SearchForm>
				</section>
				<section id="results-container" >
					<h2 >Results</h2>
					<hr id="break" />
					<div id="results-list" >
						<OGPCardControl />
					</div>
				</section>
			</div>
		);
	}
}

export default App;
