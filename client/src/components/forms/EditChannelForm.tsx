import * as React from "react";
import { Form, Message, Button, Segment } from "semantic-ui-react";
import Scrollbars from "react-custom-scrollbars";

interface Props {
  count: number;
  description: string;
  name: string;
  warning: string;
  submit: () => void;
  handleChange: (e: any) => void;
}
const EditChannelForm: React.SFC<Props> = props => (
  <Form
    loading={props.count !== 0}
    onSubmit={props.submit}
    warning={props.warning.length !== 0}
  >
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
        label="DESCRIPTION"
        name="description"
        onChange={props.handleChange}
      />
    </Scrollbars>
    <Message warning>{props.warning}</Message>
    <Segment basic clearing className="pa0 ma0">
      <Button type="submit" className="bg-green white" floated="right" size="tiny">
        SAVE
      </Button>
    </Segment>
  </Form>
);

export default EditChannelForm;
