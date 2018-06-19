import * as React from "react";
import { Segment, Header } from "semantic-ui-react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, RouteComponentProps, Redirect } from "react-router-dom";
import { parse } from 'query-string';

import "../styles/login.css";

import { Actions, model } from "../redux/";
import { signin, showMessageBar, hideMessageBar } from "../redux/operations";
import { isAuth } from "../auth/isauth";
import LoginForm from "../components/forms/LoginForm";

interface Props extends StateProps, DispatchProps {}

interface State {
  email: string;
  password: string;
}

class Login extends React.Component<Props & RouteComponentProps<any>, State> {
  readonly state = {
    email: "",
    password: ""
  };

  componentDidMount() {
    console.log(this.props);
    const { location } = this.props;
    if (location.state) {
      console.log(location.state);
      this.props.showMessageBar!(location.state.color, location.state.message);
    }
  }

  componentWillUnmount() {
    this.props.hideMessageBar!();
  }

  handleChange = (e: any) =>
    this.setState({ [e.target.name]: e.target.value } as any);

  signin = async () => {
    const { email, password } = this.state;
    let resp = (await this.props.signin!(email, password)) as any;
    if (resp !== null) {
      this.setState({ email: "", password: "" });
    } else {
      this.props.history.push("channel/");
    }
  };

  render() {
    const { fetching } = this.props;
    const { email, password } = this.state;
    const qs = parse(this.props.location.search);
    if (isAuth() && qs.redir) {
      return <Redirect to={"/channel/" + qs.redir} />;
    } else if (isAuth()) {
      return <Redirect to="/channel/" />;
    }

    return (
      <div className="w-100 h-100 bg-blue white container-middle">
        <Header content="react-slack-clone" size="huge" className="white i" />
        <Segment padded="very" id="form-container">
          <Header className="tc fw3" as="h2">
            Log In
          </Header>
          <LoginForm
            email={email}
            password={password}
            count={fetching.count}
            submit={this.signin}
            handleChange={this.handleChange}
          />
        </Segment>
        <Link to="/signup" className="white">
          Don't have an account? Get Started
        </Link>
      </div>
    );
  }
}

interface StateProps {
  fetching: model.FetchState;
}

const mapStateToProps = (state: model.StoreState): StateProps => ({
  fetching: state.fetching
});

interface DispatchProps {
  signin?: typeof signin;
  showMessageBar?: typeof showMessageBar;
  hideMessageBar?: typeof hideMessageBar;
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ signin, showMessageBar, hideMessageBar }, dispatch)
});

export default connect<Props>(
  mapStateToProps,
  mapDispatchToProps
)(Login);
