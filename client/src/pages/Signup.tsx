import * as React from "react";
import { Header, Segment } from "semantic-ui-react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, RouteComponentProps } from "react-router-dom";

import { Actions, model } from "../redux/";
import { signup, hideMessageBar, showMessageBar } from "../redux/operations/operations";
import SignupForm from "../components/forms/SignupForm";

interface Props extends StateProps, DispatchProps {}

class Signup extends React.Component<Props & RouteComponentProps<any>, model.SignupFormArgs> {
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
    // if signup was succesful push back to login page
    if (resp === null) {
      this.props.history.push("/");
      this.props.showMessageBar!("green", "Account succesfully created");
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
          <Header className="tc fw3" as="h2"> Sign Up </Header>
            <SignupForm 
              email={email}
              username={username}
              firstname={firstname}
              lastname={lastname}
              password={password}
              passwordconf={passwordconf}
              count={fetching.count}
              handleChange={this.handleChange}
              signup={this.signup}
            />
        </Segment>
        <Link to="/" className="white">
          Already have an acount? Login
        </Link>
        <span className="gray2 pt2">
          <a href="https://github.com/jadiego/react-slack-clone" className="gray2">Source Code</a>
        </span>
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
  signup?: typeof signup;
  hideMessageBar?: typeof hideMessageBar;
  showMessageBar?: typeof showMessageBar;
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ signup, hideMessageBar, showMessageBar }, dispatch)
});

export default connect<Props>(
  mapStateToProps,
  mapDispatchToProps
)(Signup);
