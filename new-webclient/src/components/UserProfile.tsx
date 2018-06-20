import * as React from "react";
import { Card, Image } from "semantic-ui-react";

import "../styles/userprofile.css";

import { model } from "../redux"

interface Props {
  user: model.User | null;
}

class UserProfle extends React.Component<Props> {
  render() {
    const { user } = this.props;
    if (user === null) {
      return null;
    }
    
    return (
        <Card className="w-100 bg-gray" id="user-profile">
          <Card.Content>
            <Image
              floated="right"
              ui
              size="mini"
              src={user.photoURL}
              spaced="right"
            />
            <Card.Header className="black2">{user.userName}</Card.Header>
          </Card.Content>
        </Card>
    );
  }
}

export default UserProfle;
