import * as React from "react";
import { Segment, Form, Button, Header } from "semantic-ui-react";
import "../styles/login.css";

class Login extends React.Component {
  render() {
    return (
      <div className="w-100 h-100 bg-blue white container-middle">
        <Header content="react-slack-clone" size="huge" className="white i"/>
        <Segment padded="very" id="form-container">
          <Form>
            <Form.Field>
              <input placeholder="Email address" />
            </Form.Field>
            <Form.Field>
              <input placeholder="Password" />
            </Form.Field>
            <Button type='submit' fluid content="Login" className="bg-blue white"/>
          </Form>
        </Segment>
        <p>Don't have an account? Get Started</p>
      </div>
    );
  }
}

export default Login;
