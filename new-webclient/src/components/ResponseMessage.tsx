import * as React from "react";
import { Message, SemanticCOLORS } from "semantic-ui-react";
import "../styles/responsemessage.css";

interface Props {
  open: boolean;
  message?: string;
  color?: SemanticCOLORS;
}

class ResponseMessage extends React.Component<Props> {
  render() {
    const { props } = this;
    if (!props.open || !props.message) {
      return null;
    }
  
    if (!props.color) {
      return <Message id="responsemessage" className="w-100">{props.message}</Message>
    } else {
      return <Message id="responsemessage" color={props.color} className="w-100">{props.message}</Message>;
    }
  }
}

export default ResponseMessage;
