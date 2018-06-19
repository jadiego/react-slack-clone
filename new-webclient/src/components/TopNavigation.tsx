import * as React from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";
import { model } from "../redux";

interface Props {
  currentchannel: model.Channel | null;
}
const TopNavigation: React.SFC<Props> = props => {
  if (props.currentchannel === null) {
    return <Segment id="client-header" />;
  } else {
    return (
      <Segment id="client-header">
        <div className="w-100" style={{ position: "relative" }}>
          <Header size="small" as="span">
            <Icon name="hashtag" className="gray2" />
            <Header.Content>{props.currentchannel.name}</Header.Content>
          </Header>
          <Button icon="info" size="mini" floated="right" />
        </div>
      </Segment>
    );
  }
};

export default TopNavigation;
