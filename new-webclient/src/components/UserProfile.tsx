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
              size="mini"
              src={user.photoURL}
              ui
              spaced="right"
            />
            <Card.Header className="black2">{user.userName}</Card.Header>
            <Card.Meta className="gray">{user.email}</Card.Meta>
          </Card.Content>
        </Card>
    );
  }
}

export default UserProfle;
