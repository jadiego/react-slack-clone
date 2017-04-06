import React, { Component } from 'react';

import { Navbar, Nav, NavItem, Form, FormControl, InputGroup, Button, Glyphicon } from 'react-bootstrap';

import '../css/App.css';

class TopNavbar extends Component {
	render() {
		return (
			<Navbar fixedTop={true}>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#">OGPSearch</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullRight>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}


class ogpcard extends Component {
	render() {
		return (
			<div></div>
		)
	}
}

class SearchForm extends Component {

	// method to call when search button is clicked
	search = (e) => {
		e.preventDefault();
		let url = document.querySelector("#url").value;
		console.log("Searching:", url)
		// call on API to get Opengraph properties
		fetch("http://localhost:8000/v1/summary?url=" + url)
			.then(function (resp) {
				return resp.json()
			})
			.then(function(data) {
				console.log(data)
				// When the server responds with a JSON of the OGP properties
				// render the summary data to the page. Atleast renders the
				// image, title, and description property.
				// Handles missing properties gracefully.
				// Communicates back the error if it comes across one.

			})
			.catch(function(err) {
				console.log(err)
			})
	}

	render() {
		return (
			<Form id="search-form" onSubmit={this.search}>
				<p>Search for a web page <strong>URL</strong> here! It will bring back a <strong>summary</strong> of the webpage.</p>
				<InputGroup bsSize="small">
					<InputGroup.Button onClick={this.search}>
						<Button>
							<Glyphicon glyph="search" aria-label="Search" />
						</Button>
					</InputGroup.Button>
					<FormControl id="url" name="url" type="text" placeholder="Search..." />
					<InputGroup.Addon onClick={this.search}> Search </InputGroup.Addon>
				</InputGroup>
			</Form>
		);
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
				<section id="results-container" fluid={true}>
					<h2 >Results</h2>
					<hr id="break" />
					<div id="results-list" fluid={true}>
					</div>
				</section>
			</div>
		);
	}
}

export default App;
