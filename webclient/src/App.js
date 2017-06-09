import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter, Route } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { bindActionCreators } from 'redux';
import { fetchCheckSession } from './redux/actions';
import { connect } from 'react-redux';

import Messages from './components/messages';

import './styles/app.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter forceRefresh={!('pushState' in window.history)} >
                <Container fluid id='app'>
                    <Route path='/' component={Messages}/>
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
        fetchCheckSession,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
