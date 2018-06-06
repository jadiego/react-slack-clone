import * as React from "react";

class Chat extends React.Component {
  render() {
    return (
      <div>
        <p>hello this is chat. this is protected</p>
        <p>{`Your token: ${localStorage.getItem("t")}`}</p>
      </div>
    )
  }
}

export default Chat;
