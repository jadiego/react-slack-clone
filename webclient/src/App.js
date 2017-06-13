import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { Container, Sidebar, Segment } from 'semantic-ui-react';
import { isEmpty, isEqual } from 'lodash';

import { bindActionCreators } from 'redux';
import { checkSession, getUsers, getChannels, getSessionKey, getChannelMessages, setCurrentChannel } from './redux/actions';
import { connect } from 'react-redux';

import Messages from './components/messages';
import MainSidebar from './components/mainsidebar';
import SubSidebar from './components/subsidebar';
import TopNavbar from './components/topnav';

import './styles/app.css';

class App extends Component {
  componentWillMount() {
    if (getSessionKey()) {
      this.props.checkSession()
        .then(resp => {
          if (!isEmpty(resp)) {
            this.props.getUsers()
              .then(resp => this.props.getChannels())
              .then(resp => this.props.setCurrentChannel(this.props.location.pathname.split("/")[2]))
              .then(resp => this.props.getChannelMessages())
          }
        })
    }
  }

  render() {
    return (
      <Container fluid id='app'>
        <MainSidebar />
        <TopNavbar />
        <Sidebar.Pushable as={Segment} id='pushable-container'>
          <SubSidebar />
          <Sidebar.Pusher>
            <Route exact path='/' render={() => <Redirect to='/messages/general' />} />
            <Route exact path='/messages' render={() => <Redirect to='/messages/general' />} />
            <Route exact path='/messages/:channelname' component={Messages} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    checkSession,
    getUsers,
    getChannels,
    getChannelMessages,
    setCurrentChannel
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
