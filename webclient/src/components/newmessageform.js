import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TextArea } from 'semantic-ui-react';

import { bindActionCreators } from 'redux';
import { postMessage } from '../redux/actions';
import { connect } from 'react-redux';

class NewMessageForm extends Component {
  state = {
    text: "",
  }

  handleChange = (e, d) => this.setState({ text: e.target.value })

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      this.props.messagesEndRef.scrollIntoView({ behavior: "smooth" });
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.props.postMessage(this.state.text)
        .then(resp => {
          this.setState({ text: "" })
          this.props.messagesEndRef.scrollIntoView({ behavior: "smooth" });
        })
    }
  }

  render() {
    const { text } = this.state;
    return (
      <TextArea placeholder='chat' autoHeight value={text} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    postMessage
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(NewMessageForm);
