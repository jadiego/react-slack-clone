import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Login from './login/LoginContainer';
import Signup from './login/SignupContainer';
import View from './components/ViewContainer';


import { Auth } from './Auth';


class App extends Component {
    render() {
        return (
            <BrowserRouter forceRefresh={!('pushState' in window.history)} >
                <Container fluid id='app'>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/" component={Signup} />
                        <AuthRoute exact path="/messages" component={View} />
                        <AuthRoute exact path="/profile" component={View} />
                </Container>
            </BrowserRouter>
        )
    }
}

const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        Auth.isAuthenticated() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
    )} />
)

export default App