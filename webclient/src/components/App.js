import React, { Component } from 'react'
import { Menu, Input, Container, Message, Card } from 'semantic-ui-react'
import connect from 'react-redux'

import SearchForm from './SearchForm'

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


class App extends Component {
	constructor() {
		super();
		this.state = {}
	}

	render() {
		return (
			<div>
				<TopNavbar />
				<section id="search-container">
					<SearchForm />
				</section>
				<section id="results-container" >
					<h2 >Results</h2>
					<hr id="break" />
					<div id="results-list" >
					</div>
				</section>
			</div>
		);
	}
}

export default App