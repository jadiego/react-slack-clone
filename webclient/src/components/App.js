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
						<NavItem eventKey={1} href="#">Link 1</NavItem>
						<NavItem eventKey={2} href="#">Link 2</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

class SearchForm extends Component {

	// method to call when search button is clicked
	search = (e) => {
		e.preventDefault();
		let url = document.querySelector("#url").value;
		console.log("Searching:", url)
		fetch("http://localhost:8000/v1/summary?url=" + url)
			.then(function (resp) {
				return resp.json()
			})
			.then(function(data) {
				console.log(data)
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
					<InputGroup.Addon> {0} results </InputGroup.Addon>
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
			</div>
		);
	}
}

export default App;
