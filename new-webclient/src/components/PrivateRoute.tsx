import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router";

export interface Props extends RouteProps {
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
                pathname: "/",
                state: {
                  referrer: props.location.pathname,
                  reason: "Unauthorized",
                  color: "red",
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

function isAuth() {
  if (process.env.REACT_APP_API_TOKEN_KEY === undefined) {
    throw Error("auth env key not set");
  }

  let t = localStorage.getItem(process.env.REACT_APP_API_TOKEN_KEY);

  return t !== null && t.length !== 0;
}

export default PrivateRoute;
