import * as React from "react";
import { Item } from "semantic-ui-react";

interface Props {
  body: string;
  photoUrl: string;
  date: string;
  name: string;
}

const Message = (props: Props) => (
  <Item>
    <Item.Image size="mini" src={props.photoUrl} />
    <Item.Content>
      <Item.Meta>
        <span className="comment-name">{props.name}</span>
        <span className="comment-date">{props.date}</span>
      </Item.Meta>
      <Item.Description>{props.body}</Item.Description>
    </Item.Content>
  </Item>
);

export default Message;
