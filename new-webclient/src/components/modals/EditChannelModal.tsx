import * as React from "react";
import {
  Popup,
  Icon,
  Segment,
  TransitionablePortal,
  Header,
  Button,
  Message
} from "semantic-ui-react";
import { model } from "../../redux";
import "../../styles/modal.css";
import { connect } from "react-redux";
import EditChannelForm from "../forms/EditChannelForm";
import DeleteChannelButton from "./DeleteChannelModal";

const EditButton = (props: any) => (
  <Popup
    trigger={
      <Icon name="setting" style={{ float: "right" }} onClick={props.onClick} />
    }
    content="Edit channel"
    position="top center"
    inverted
    basic
    style={{ paddingTop: "3px", paddingBottom: "3px" }}
  />
);

interface Props extends StateProps {
  channel: model.Channel;
}

interface State {
  visible: boolean;
  description: string;
  name: string;
  warning: string;
}

const initialState: State = {
  visible: false,
  description: "",
  name: "",
  warning: ""
};
class EditChannelButton extends React.Component<Props, State> {
  readonly state = {
    visible: false,
    description: this.props.channel.description,
    name: this.props.channel.name,
    warning: ""
  };

  handleChange = (e: any) =>
    this.setState({ [e.target.name]: e.target.value } as any);

  handleOpen = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ visible: true });
  };

  handleClose = () => this.setState(initialState);

  submit = () => {
    // do something
  };

  render() {
    const { fetching, channel } = this.props;
    const { visible, description, name, warning } = this.state;

    return (
      <React.Fragment>
        <EditButton onClick={this.handleOpen} />

        <TransitionablePortal
          onClose={this.handleClose}
          open={visible}
          transition={{ animation: "fade up", duration: 150 }}
          closeOnTriggerBlur={false}
          closeOnTriggerMouseLeave={false}
          closeOnDocumentClick={false}
        >
          <Segment
            basic
            className="w-100 h-100 bg-white modal-container"
            style={{ left: "0%", position: "fixed", top: "0%", zIndex: 1000 }}
            clearing
            color="blue"
          >
            <Button
              circular
              icon="close"
              floated="right"
              onClick={this.handleClose}
              size="tiny"
            />
            <Segment basic padded className="modal-inner" clearing>
              <Header size="huge">Channel Overview</Header>
              <EditChannelForm
                count={fetching.count}
                description={description}
                name={name}
                warning={warning}
                submit={this.submit}
                handleChange={this.handleChange}
              />
              <Header size="huge">Danger Zone</Header>
              <Message as={Segment} clearing>
                <DeleteChannelButton id={channel.id}/>
                <Message.Header>Delete this channel</Message.Header>
                <span>
                  Once you delete a channel, there is no going back. Please
                  be certain.
                </span>
              </Message>
            </Segment>
          </Segment>
        </TransitionablePortal>
      </React.Fragment>
    );
  }
}

interface StateProps {
  fetching: model.FetchState;
}

const mapStateToProps = (state: model.StoreState): StateProps => ({
  fetching: state.fetching
});

// interface DispatchProps {
//   createChannel?: typeof createChannel;
// }

// const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
//   ...bindActionCreators({ createChannel }, dispatch)
// });

export default connect<StateProps>(mapStateToProps)(EditChannelButton);
