import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import PrivateRoute from "../auth/PrivateRoute";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Chat from "../pages/Chat";
import ResponseMessage from "./ResponseMessage";

import { model } from "../redux/";

class App extends React.Component<StateProps> {
  render() {
    const { messageBar } = this.props;

    // 47px is the exact height if you inspect the ResponseMessage.tsx component
    let height = "100%";
    if (messageBar.visible) {
      height = "calc(100% - 47px)";
    }
    
    return (
      <BrowserRouter>
        <React.Fragment>
          <ResponseMessage open={messageBar.visible} message={messageBar.message} color={messageBar.color} />
          <div className="w-100 h-100" style={{ height }}>
            <Switch>
              <PrivateRoute path="/channel/" component={Chat} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/" component={Login} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

interface StateProps {
  messageBar: model.MessageBarState;
}

const mapStateToProps = (state: model.StoreState): StateProps => ({
  messageBar: state.messagebar
});

export default connect<StateProps>(mapStateToProps)(App);
