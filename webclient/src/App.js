import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import _, { isEmpty } from 'lodash';
import 'whatwg-fetch';

import Login from './login/LoginContainer';
import Signup from './login/SignupContainer';
import View from './components/ViewContainer';

import { bindActionCreators } from 'redux';
import { fetchCheckSession } from './actions';
import { connect } from 'react-redux';

class App extends Component {
    componentDidMount() {
        this.props.fetchCheckSession()
    }
    
    render() {
        const AuthRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={props => (
                !_.isEmpty(this.props.currentUser) && localStorage.getItem("auth") ? (
                    <Component {...props} />
                ) : (
                        <Redirect to={{
                            pathname: '/login',
                            state: { from: props.location }
                        }} />
                    )
            )} />
        )

        return (
            <BrowserRouter forceRefresh={!('pushState' in window.history)} >
                <Container fluid id='app'>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/" component={Signup} />
                    <AuthRoute exact path="/messages/:channelname" component={View} />
                    <AuthRoute exact path="/profile" component={View} />
                    <Route path='/messages' render={() => <Redirect to ='/messages/general' />}/>
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