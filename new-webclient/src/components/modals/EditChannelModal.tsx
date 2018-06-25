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
import { model, Actions } from "../../redux";
import "../../styles/modal.css";
import { connect, Dispatch } from "react-redux";
import EditChannelForm from "../forms/EditChannelForm";
import DeleteChannelButton from "./DeleteChannelModal";
import { updateChannel } from "../../redux/operations";
import { bindActionCreators } from "redux";

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

interface Props extends StateProps, DispatchProps {
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
    let { name, description } = this.props.channel;
    this.setState({ visible: true, name, description});
  };

  handleClose = () => this.setState(initialState);

  submit = () => {
    this.setState({ warning: "" });
    let args = {
      name: this.state.name,
      description: this.state.description
    } as model.EditChannelFormArgs;
    (async () => {
      let resp = await this.props.updateChannel!(this.props.channel.id, args);
      if (resp !== null) {
        this.setState({ warning: (resp as any) as string });
      } else {
        this.setState({ visible: false });
      }
    })();
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
                <DeleteChannelButton id={channel.id} />
                <Message.Header>Delete this channel</Message.Header>
                <span>
                  Once you delete a channel, there is no going back. Please be
                  certain.
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

interface DispatchProps {
  updateChannel?: typeof updateChannel;
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ updateChannel }, dispatch)
});

export default connect<StateProps>(
  mapStateToProps,
  mapDispatchToProps
)(EditChannelButton);
