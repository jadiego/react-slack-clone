// lib imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// app imports
import './styles/app.css';
import landing from './components/landing';
import notFound from './components/notFound';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact={true} path="/" component={landing} />
            <Route path="*" component={notFound} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
