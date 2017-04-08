import React, { Component } from 'react'

import { Input } from 'semantic-ui-react'
import { fetchURL } from '../actions'

class SearchForm extends Component {

    handleOnKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            console.log(this)
            const url = e.target.value
            console.log(url)
            fetchURL(url)
        }
    }

    render() {
        return (
            <div id='search-input'>
                <p>Search for a <strong>web page</strong> here! It will bring back a <strong>summary</strong> of the webpage.</p>
                <Input id='url'
                    onKeyPress={this.handleOnKeyPress.bind(this)} fluid size='tiny'
                    action={{ icon: 'search', disabled: true}}
                    placeholder='http://ogp.me/' />
            </div>
        );
    }
}
export default SearchForm