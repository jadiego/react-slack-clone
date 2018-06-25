import * as React from "react";
import { model, Actions } from "../redux/";
import { Menu, Icon } from "semantic-ui-react";
import AddChannelButton from "./modals/AddChannelModal";
import AddDMChannelButton from "./modals/DirectMessageModal";
import EditChannelButton from "./modals/EditChannelModal";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Dispatch, connect } from "react-redux";
import { setCurrentChannel, getChannelMessages } from "../redux/operations";

interface Props extends DispatchProps {
  channels: model.Channel[];
  users: model.User[];
  currentChannel: model.Channel | null;
  currentUser: model.User | null;
}

class ChannelsAndUsersList extends React.Component<Props> {
  async changeChannel(chan: model.Channel) {
    if (chan.id === this.props.currentChannel!.id) {
      return;
    }
    await this.props.getChannelMessages!(chan.id);
    await this.props.setCurrentChannel!(chan);
  }

  idToUsername(id: string) {
    return this.props.users.find((u) => u.id === id)!.userName;
  }

  render() {
    const { channels, currentChannel, currentUser, users } = this.props;

    let chans = channels.filter(c => c.type === 0);
    let dmchans = channels.filter(c=> c.type === 1);

    return (
      <Menu vertical borderless fluid>
        <Menu.Item>
          <Menu.Header className="gray">
            CHANNELS
            <AddChannelButton />
          </Menu.Header>

          <Menu.Menu>
            {chans.map(chan => (
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
                {currentUser && currentUser.id === chan.creatorid ? (
                  <EditChannelButton channel={chan} />
                ) : null}
              </Menu.Item>
            ))}
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header className="gray">
            DIRECT MESSAGES
            <AddDMChannelButton users={users}/>
          </Menu.Header>

          <Menu.Menu>
          {dmchans.map(chan => (
              <Menu.Item
                key={chan.id}
                name={chan.id}
                as={Link}
                to={`/channel/${chan.id}`}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => this.changeChannel(chan)}
                active={
                  currentChannel !== null && currentChannel.id === chan.id
                }
              >
                <Icon name="at" style={{ float: "left" }} />
                {this.idToUsername(chan.members[0])}
              </Menu.Item>
            ))}
          </Menu.Menu>
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
