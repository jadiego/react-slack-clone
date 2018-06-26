import * as React from "react";
import { Segment } from "semantic-ui-react";
import TopNavigation from "../components/TopNavigation";
import MessageList from "../components/MessageList";
import TextEditor from "../components/TextEditor";
import { model } from "../redux";

interface Props {
  loading: boolean;
  messages: model.Message[];
  currentchannel: model.Channel | null;
}

class MessageContainer extends React.Component<Props> {
  messageEnd: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.messageEnd = React.createRef();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.currentchannel &&
      this.props.currentchannel &&
      prevProps.currentchannel.id !== this.props.currentchannel.id
    ) {
      this.scrollToBottom("instant");
    }
  }

  scrollToBottom = (behavior: ScrollBehavior) => {
    this.messageEnd.current!.scrollIntoView({ behavior });
  };

  render() {
    return (
      <React.Fragment>
        <TopNavigation currentchannel={this.props.currentchannel}/>
        <Segment
          className="bg-white black"
          id="messages-container"
          loading={this.props.loading}
        >
          <MessageList
            messages={this.props.messages}
            messageEnd={this.messageEnd}
          />
          <TextEditor scrollToBottom={this.scrollToBottom} />
        </Segment>
      </React.Fragment>
    );
  }
}

export default MessageContainer;
