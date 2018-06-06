import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Chat from "../pages/Chat";
import ResponseMessage from "./ResponseMessage";
import { StoreState, MessageBarState } from "../redux/types";
import { connect } from "react-redux";

class App extends React.Component<StateProps> {
  render() {
    const { messageBar } = this.props;

    let height = "100%";
    if (messageBar.visible) {
      height = "calc(100% - 49px)";
    }
    
    return (
      <BrowserRouter>
        <React.Fragment>
          <ResponseMessage open={messageBar.visible} message={messageBar.message} color={messageBar.color} />
          <div className={`w-100 h-100 bg-blue white container-middle`} style={{height }}>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <PrivateRoute path="/channel/:channelid" component={Chat} />
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

interface StateProps {
  messageBar: MessageBarState;
}

const mapStateToProps = (state: StoreState): StateProps => ({
  messageBar: state.messagebar
});

export default connect<StateProps>(mapStateToProps)(App);
