import * as React from "react";
import { Form, Header, Checkbox, Message, Button } from "semantic-ui-react";

interface Props {
  count: number;
  checked: boolean;
  description: string;
  name: string;
  warning: string;
  submit: () => void;
  togglePrivacy: () => void;
  handleChange: (e: any) => void;
}
const AddChannelForm: React.SFC<Props> = (props) =>  (
  <Form
              loading={props.count !== 0}
              onSubmit={props.submit}
              warning={props.warning.length !== 0}
            >
              <Form.Field>
                <label>
                  PRIVACY: {props.checked ? "PRIVATE" : "PUBLIC"}
                </label>
                <Checkbox
                  toggle
                  checked={props.checked}
                  onChange={props.togglePrivacy}
                />
                <Header.Subheader style={{ color: "grey", fontSize: "12px" }}>
                  Public Channels can be joined by anyone.
                </Header.Subheader>
              </Form.Field>
              <Form.Input
                type="text"
                placeholder="e.g. announcements, random"
                label="NAME"
                value={props.name}
                autoComplete="off"
                onChange={props.handleChange}
                name="name"
              />
              <Form.Input
                type="text"
                placeholder="What is this channel about?"
                value={props.description}
                label="DESCRIPTION (OPTIONAL)"
                name="description"
                onChange={props.handleChange}
              />
              <Button
                type="submit"
                fluid
                className="submit-button"
              >
                SUBMIT
              </Button>
              <Message warning>{props.warning}</Message>
            </Form>
)

export default AddChannelForm;
