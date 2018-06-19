import * as React from "react";
import { model, Actions } from "../redux/";
import { Menu, Icon } from "semantic-ui-react";
import AddChannelButton from "./modals/AddChannelModal";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Dispatch, connect } from "react-redux";
import { setCurrentChannel, getChannelMessages } from "../redux/operations";

interface Props extends DispatchProps {
  channels: model.Channel[];
  users: model.User[];
  currentChannel: model.Channel | null;
}

class ChannelsAndUsersList extends React.Component<Props> {
  async changeChannel(chan: model.Channel) {
    await this.props.getChannelMessages!(chan.id);
    await this.props.setCurrentChannel!(chan);
  }

  render() {
    const { channels, currentChannel } = this.props;
    return (
      <Menu vertical borderless fluid>
        <Menu.Item>
          <Menu.Header className="gray">
            CHANNELS
            <AddChannelButton />
          </Menu.Header>

          <Menu.Menu>
            {channels.map(chan => (
              <Menu.Item
                key={chan.id}
                name={chan.name}
                as={Link}
                to={`/channel/${chan.id}`}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => this.changeChannel(chan)}
                active={
                  currentChannel !== null && currentChannel.id === chan.id
                }
              >
                {chan.private ? (
                  <Icon name="lock" style={{ float: "left" }} />
                ) : (
                  <Icon name="hashtag" style={{ float: "left" }} />
                )}
                {chan.name}
              </Menu.Item>
            ))}
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header className="gray">
            DIRECT MESSAGES
            <AddChannelButton />
          </Menu.Header>

          <Menu.Menu>{/* messages go here */}</Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }
}

interface DispatchProps {
  setCurrentChannel?: typeof setCurrentChannel;
  getChannelMessages?: typeof getChannelMessages;
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ setCurrentChannel, getChannelMessages }, dispatch)
});

export default connect<Props>(
  null,
  mapDispatchToProps
)(ChannelsAndUsersList);
