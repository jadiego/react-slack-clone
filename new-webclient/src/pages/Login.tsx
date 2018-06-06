import * as React from "react";
import { Segment, Form, Button, Header } from "semantic-ui-react";
import { connect, Dispatch } from "react-redux";
import "../styles/login.css";
import { bindActionCreators } from "redux";
import { signin, showMessageBar, hideMessageBar } from "../redux/operations";
import { Actions } from "../redux/action-helper";
import { StoreState, FetchState } from "../redux/types";
import { Link, RouteComponentProps } from "react-router-dom";

interface Props extends StateProps, DispatchProps {}

interface State {
  email: string;
  password: string;
}

class Login extends React.Component<Props & RouteComponentProps<any>, State> {
  readonly state = {
    email: "",
    password: "",
  };

  // check if we were redirected to /Login from 
  // some other page. 
  componentDidMount() {
    const { location } = this.props
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
    let resp = await this.props.signin!(email, password) as any;
    if (resp !== null) {
      this.setState({ email: "", password: "" });
    } else {
      this.props.history.push("channel/ssd")
    }
  };

  render() {
    const { fetching } = this.props;
    const { email, password } = this.state;

    return (
      <div className="w-100 h-100 bg-blue white container-middle">
        <Header content="react-slack-clone" size="huge" className="white i" />
        <Segment padded="very" id="form-container">
          <Header className="tc fw3" as="h2"> Log In </Header>
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
                placeholder="Password"
                onChange={this.handleChange}
                name="password"
                type="password"
                value={password}
                required
              />
            </Form.Field>
            <Button
              type="submit"
              fluid
              content="SUBMIT"
              className="bg-blue white"
              onClick={this.signin}
            />
          </Form>
          
        </Segment>
        <Link to="/signup" className="white">Don't have an account? Get Started</Link>
      </div>
    );
  }
}

interface StateProps {
  fetching: FetchState;
}

const mapStateToProps = (state: StoreState): StateProps => ({
  fetching: state.fetching,
});

interface DispatchProps {
  signin?: typeof signin;
  showMessageBar?: typeof showMessageBar;
  hideMessageBar?: typeof hideMessageBar
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ signin, showMessageBar, hideMessageBar }, dispatch)
});

export default connect<Props>(mapStateToProps, mapDispatchToProps)(Login);
