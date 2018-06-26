import * as React from "react";
import { Form, Header, Checkbox, Message, Button, Segment } from "semantic-ui-react";
import Scrollbars from "react-custom-scrollbars";

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
const AddChannelForm: React.SFC<Props> = props => (
  <Form
    loading={props.count !== 0}
    onSubmit={props.submit}
    warning={props.warning.length !== 0}
  >
    <Form.Field>
      <label>PRIVACY: {props.checked ? "PRIVATE" : "PUBLIC"}</label>
      <Checkbox toggle checked={props.checked} onChange={props.togglePrivacy} />
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
    <Scrollbars autoHeight autoHide autoHeightMax={200} autoHeightMin={144}>
      <Form.Field
        control="textarea"
        rows={4}
        placeholder="No description set."
        value={props.description}
        label="DESCRIPTION (OPTIONAL)"
        name="description"
        onChange={props.handleChange}
      />
    </Scrollbars>
    <Message warning>{props.warning}</Message>
    <Segment basic clearing className="pa0 ma0">
      <Button type="submit" className="bg-green white" floated="right" size="tiny">
        SUBMIT
      </Button>
    </Segment>
  </Form>
);

export default AddChannelForm;
