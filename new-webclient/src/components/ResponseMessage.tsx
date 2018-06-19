import * as React from "react";
import { SemanticCOLORS, Segment } from "semantic-ui-react";
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
      return <Segment inverted id="responsemessage" color="grey" className="w-100">{props.message}</Segment>
    } else {
      return <Segment inverted id="responsemessage" color={props.color} className="w-100">{props.message}</Segment>;
    }
  }
}

export default ResponseMessage;
