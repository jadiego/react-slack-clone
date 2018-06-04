import * as React from "react";
import * as ReactDOM from "react-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "semantic-ui-css/semantic.min.css";
import "tachyons/css/tachyons.min.css";
import "./styles/index.css";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./redux/reducers";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk)),
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <Switch>
      <Route exact={true} path="/" component={Login} />
      <Route path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
