import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

class Router extends Component {
  render() {
    return (
      <BrowserRouter forceRefresh={!('pushState' in window.history)} >
        <App/>
      </BrowserRouter>
    );
  }
}

export default Router;