import { Form, Button } from "semantic-ui-react";
import * as React from "react";


interface Props {
  count: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  passwordconf: string;
  email: string;
  handleChange: (e: any) => void;
  signup: () => void;
}
const SignupForm: React.SFC<Props> = (props) => (
  <Form loading={props.count !== 0}>
            <Form.Field>
              <input
                placeholder="Email address"
                onChange={props.handleChange}
                name="email"
                type="email"
                value={props.email}
                required
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="Username"
                onChange={props.handleChange}
                name="username"
                type="text"
                value={props.username}
                required
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="First Name"
                onChange={props.handleChange}
                name="firstname"
                type="text"
                value={props.firstname}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="Last Name"
                onChange={props.handleChange}
                name="lastname"
                type="text"
                value={props.lastname}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="Password"
                onChange={props.handleChange}
                name="password"
                type="password"
                value={props.password}
                required
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="Confirm Password"
                onChange={props.handleChange}
                name="passwordconf"
                type="password"
                value={props.passwordconf}
                required
              />
            </Form.Field>
            <Button
              type="submit"
              fluid
              content="SIGN UP"
              className="bg-green white"
              onClick={props.signup}
            />
          </Form>
)

export default SignupForm;