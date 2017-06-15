import React, { Component } from 'react';
import { Search, List, Image } from 'semantic-ui-react';
import { filter, escapeRegExp } from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const resultRenderer = ({ id, email, userName, firstName, lastName, photoURL }) => (
  <List.Item key={id}>
    <Image shape='rounded' src={photoURL} mini/>
    <List.Content>
      <List.Header>{userName}</List.Header>
      <List.Description>{firstName} {lastName}</List.Description>
    </List.Content>
  </List.Item>
)

resultRenderer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

class SearchUser extends Component {

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, result) => this.setState({ value: result.userName })

  handleSearchChange = (e, value) => {
    this.setState({ isLoading: true, value })
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.userName)
      this.setState({
        isLoading: false,
        results: filter(this.props.users, isMatch),
      })
    }, 500)
  }

  render() {
    const { isLoading, value, results } = this.state
    return (
      <Search
        results={results}
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        value={value}
        resultRenderer={resultRenderer}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}

export default connect(mapStateToProps)(SearchUser);