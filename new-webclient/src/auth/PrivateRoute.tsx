import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { isAuth } from "../auth/isauth";

interface Props extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.SFC<Props> = (props) => {
  let { component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      // tslint:disable-next-line:jsx-no-lambda no-shadowed-variable
      render={props => {
        if (isAuth()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/?redir=" + encodeURIComponent(props.location.pathname),
                state: {
                  color: "yellow",
                  message: "You need to sign in first for access to this page"
                }
              }}
            />
          );
        }
      }}
    />
  );
};

export default PrivateRoute;
