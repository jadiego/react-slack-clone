import * as React from "react";

import { model } from "../redux";
import Scrollbars from "react-custom-scrollbars";
import Message from "./Message";
import { connect } from "react-redux";
import memoizeOne from "memoize-one"; // changed export in @types file
import { Item, Divider } from "semantic-ui-react";
import * as moment from "moment";
import { formatMsg } from "../redux/util";

interface Props extends StateProps {
  messages: model.Message[];
  messageEnd: React.RefObject<HTMLDivElement>;
}

class MessageList extends React.Component<Props> {
  // filters the given messages props to properly render them with associated user
  filter = memoizeOne((users: model.User[], messages: model.Message[]) => {
    const usersObj = users.reduce((obj, user) => {
      obj[user.id] = user;
      return obj;
    }, {});
    const messagesobj = new Map<string, model.FormattedMessage[]>();
    messages.map(message => {
      const date = moment(message.createdAt).format("LL");
      if (messagesobj.has(date)) {
        messagesobj.get(date)!.push(formatMsg(message, usersObj));
      } else {
        messagesobj.set(date, [formatMsg(message, usersObj)]);
      }
    });
    return messagesobj;
  });

  filteredMessageElements = (
    messages: Map<string, model.FormattedMessage[]>
  ) => {
    let reactElements: JSX.Element[] = [];
    messages.forEach((messageDayArr, date) => {
      reactElements.push(
        <Divider horizontal className="gray2" key={date} style={{ margin: "auto 20px" }}>
          {" "}
          {date}{" "}
        </Divider>
      );
      messageDayArr.map(m => {
        reactElements.push(
          <Message
            photoUrl={m.photoUrl}
            name={m.name}
            date={m.date}
            body={m.message}
            key={m.id}
          />
        );
      });
    });
    return reactElements;
  };

  render() {
    const { messages, messageEnd, users } = this.props;
    const filteredMessages = this.filter(users, messages);
    return (
      <Scrollbars
        // tslint:disable-next-line:jsx-no-lambda
        renderTrackVertical={props => <div {...props} className="track-vertical" />}
        // tslint:disable-next-line:jsx-no-lambda
        renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
      >
        <div id="messages-list-container">
          <Item.Group>
            {this.filteredMessageElements(filteredMessages)}
          </Item.Group>
          <div style={{ float: "left", clear: "both" }} ref={messageEnd} />
        </div>
      </Scrollbars>
    );
  }
}

interface StateProps {
  users: model.User[];
}

const mapStateToProps = (state: model.StoreState): StateProps => ({
  users: state.users
});

export default connect<StateProps>(mapStateToProps)(MessageList);
