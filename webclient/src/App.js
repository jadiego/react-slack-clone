import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { Container, Sidebar, Segment } from 'semantic-ui-react';
import { isEmpty, isEqual } from 'lodash';

import { bindActionCreators } from 'redux';
import { checkSession, getUsers, getChannels } from './redux/actions';
import { connect } from 'react-redux';

import Messages from './components/messages';
import MainSidebar from './components/mainsidebar';
import SubSidebar from './components/subsidebar';
import TopNavbar from './components/topnav';

import './styles/app.css';

class App extends Component {
    componentWillMount() {
        if (localStorage.getItem("auth")) {
            this.props.checkSession()
                .then(resp => {
                    if (!isEmpty(resp)) {
                        this.props.getUsers()
                        this.props.getChannels()
                    }
                })
        }
    }

    render() {
        return (
            <BrowserRouter forceRefresh={!('pushState' in window.history)} >
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
            </BrowserRouter>
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
        getChannels
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);