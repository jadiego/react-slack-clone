import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Container, Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react';

import { connect } from 'react-redux';

import Messages from './components/messages';
import MainSidebar from './components/mainsidebar';
import SubSidebar from './components/subsidebar';
import TopNavbar from './components/topnav';

import './styles/app.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter forceRefresh={!('pushState' in window.history)} >
                <Container fluid id='app'>
                    <MainSidebar />
                    <TopNavbar />
                    <Sidebar.Pushable as={Segment} id='pushable-container'>
                        <SubSidebar/>
                        <Sidebar.Pusher>
                            <Container fluid>
                                <Route exact path='/' render={() => <Redirect to='/messages/general'/>} />
                                <Route exact path='/messages/:channelid' component={Messages} />
                            </Container>
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

export default connect(mapStateToProps)(App)
