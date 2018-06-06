import * as React from "react";
import { Header, Form, Segment, Button } from "semantic-ui-react";
import { FetchState, StoreState, SignupFormArgs } from "../redux/types";
import { connect, Dispatch } from "react-redux";
import { Actions } from "../redux/action-helper";
import { signup, hideMessageBar } from "../redux/operations";
import { bindActionCreators } from "redux";
import { Link, RouteComponentProps } from "react-router-dom";

interface Props extends StateProps, DispatchProps {}

class Signup extends React.Component<Props & RouteComponentProps<any>, SignupFormArgs> {
  readonly state = {
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    passwordconf: ""
  };

  componentWillUnmount() {
    this.props.hideMessageBar!();
  }

  handleChange = (e: any) =>
    this.setState({ [e.target.name]: e.target.value } as any);

  signup = async () => {
    let resp = (await this.props.signup!({ ...this.state })) as any;
    if (resp === null) {
      this.props.history.push("/", {
        referrer: this.props.location.pathname,
        reason: "Success",
        color: "red",
        message: "Account succesfully created"
      });
    }
  };

  render() {
    const { fetching } = this.props;
    const {
      email,
      username,
      firstname,
      lastname,
      password,
      passwordconf
    } = this.state;
    return (
      <div className="w-100 h-100 bg-blue white container-middle">
        <Header content="react-slack-clone" size="huge" className="white i" />
        <Segment padded="very" id="form-container">
          <Header className="tc fw3" as="h2">
            Sign Up
          </Header>
          <Form loading={fetching.count !== 0}>
            <Form.Field>
              <input
                placeholder="Email address"
                onChange={this.handleChange}
                name="email"
                type="email"
                value={email}
                required
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="Username"
                onChange={this.handleChange}
                name="username"
                type="text"
                value={username}
                required
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="First Name"
                onChange={this.handleChange}
                name="firstname"
                type="text"
                value={firstname}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="Last Name"
                onChange={this.handleChange}
                name="lastname"
                type="text"
                value={lastname}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="Password"
                onChange={this.handleChange}
                name="password"
                type="password"
                value={password}
                required
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="Confirm Password"
                onChange={this.handleChange}
                name="passwordconf"
                type="password"
                value={passwordconf}
                required
              />
            </Form.Field>
            <Button
              type="submit"
              fluid
              content="SUBMIT"
              className="bg-blue white"
              onClick={this.signup}
            />
          </Form>
        </Segment>
        <Link to="/" className="white">
          Already have an acount? Login
        </Link>
      </div>
    );
  }
}

interface StateProps {
  fetching: FetchState;
}

const mapStateToProps = (state: StoreState): StateProps => ({
  fetching: state.fetching
});

interface DispatchProps {
  signup?: typeof signup;
  hideMessageBar?: typeof hideMessageBar;
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ signup, hideMessageBar }, dispatch)
});

export default connect<Props>(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
