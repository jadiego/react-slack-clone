import * as React from "react";
import { Segment, Header, Icon, SemanticICONS } from "semantic-ui-react";
import { model } from "../redux";

interface Props {
  currentchannel: model.Channel | null;
}
const TopNavigation: React.SFC<Props> = props => {
  if (props.currentchannel === null) {
    return <Segment id="client-header" />;
  } else {
    let channelicon: SemanticICONS;
    if (props.currentchannel.type === 0 && !props.currentchannel.private) {
      channelicon = "hashtag";
    } else if (props.currentchannel.type === 0 && props.currentchannel.private) {
      channelicon = "lock"
    } else {
      channelicon = "at"
    }
    return (
      <Segment id="client-header">
        <div className="w-100" style={{ position: "relative" }}>
          <Header size="small" as="span">
          <Icon name={channelicon} className="gray2" />
            <Header.Content>{props.currentchannel.name}</Header.Content>
          </Header>
        </div>
      </Segment>
    );
  }
};

export default TopNavigation;
