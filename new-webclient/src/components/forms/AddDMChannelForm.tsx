import * as React from "react";
import { Form, Message, Button, DropdownItemProps, Dropdown } from "semantic-ui-react";

interface Props {
  count: number;
  warning: string;
  submit: () => void;
  handleChange: (e: any, { value }: any) => void;
  options: DropdownItemProps[];
  value: string;
}
const AddDMChannelForm: React.SFC<Props> = props => (
  <Form
    loading={props.count !== 0}
    onSubmit={props.submit}
    warning={props.warning.length !== 0}
  >
    <Form.Group widths="equal">
      <Form.Field
        control={Dropdown}
        placeholder="Find or start a conversation"
        fluid
        options={props.options}
        selection
        name="selected"
        value={props.value}
        onChange={props.handleChange}
      />
      <Button
        type="submit"
        className="bg-green white"
        size="tiny"
        content="GO"
      />
    </Form.Group>
    <Form.Group>
      <Message warning>{props.warning}</Message>
    </Form.Group>
  </Form>
);

export default AddDMChannelForm;
