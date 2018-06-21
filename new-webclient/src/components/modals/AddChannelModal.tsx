import * as React from "react";
import {
  Popup,
  Icon,
  Segment,
  TransitionablePortal,
  Header,
  Button
} from "semantic-ui-react";
import { model, Actions } from "../../redux";
import { createChannel } from "../../redux/operations";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import AddChannelForm from "../forms/AddChannelForm";
import "../../styles/modal.css";

const AddButton = (props: any) => (
  <Popup
    trigger={
      <Icon name="plus" style={{ float: "right" }} onClick={props.onClick} />
    }
    content="Create channel"
    position="top center"
    inverted
    basic
    style={{ paddingTop: "3px", paddingBottom: "3px" }}
  />
);

interface Props extends DispatchProps, StateProps {}

interface State {
  visible: boolean;
  checked: boolean;
  description: string;
  name: string;
  warning: string;
}

const initialState: State = {
  visible: false,
  checked: false,
  description: "",
  name: "",
  warning: ""
};
class AddChannelButton extends React.Component<Props, State> {
  readonly state = initialState;

  submit = () => {
    this.setState({ warning: "" });

    const { checked, description, name } = this.state;
    let args: model.NewChannelFormArgs = {
      description,
      private: checked,
      name,
      members: []
    };
    (async () => {
      let resp = await this.props.createChannel!(args);
      if (resp !== null) {
        this.setState({ warning: (resp as any) as string });
      } else {
        this.handleClose();
      }
    })();
  };

  handleChange = (e: any) =>
    this.setState({ [e.target.name]: e.target.value } as any);

  handleOpen = () => this.setState({ visible: true });

  handleClose = () => this.setState(initialState);

  togglePrivacy = () => this.setState({ checked: !this.state.checked });

  render() {
    const { visible, checked, description, name, warning } = this.state;
    const { fetching } = this.props;

    return (
      <React.Fragment>
        <AddButton onClick={this.handleOpen} />

        <TransitionablePortal
          onClose={this.handleClose}
          open={visible}
          transition={{ animation: "fade up", duration: 150 }}
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
            />
            <Segment basic padded className="modal-inner" clearing>
              <Header size="huge">Create a Channel</Header>
              <AddChannelForm
                checked={checked}
                count={fetching.count}
                description={description}
                name={name}
                warning={warning}
                submit={this.submit}
                handleChange={this.handleChange}
                togglePrivacy={this.togglePrivacy}
              />
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
  createChannel?: typeof createChannel;
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ createChannel }, dispatch)
});

export default connect<Props>(
  mapStateToProps,
  mapDispatchToProps
)(AddChannelButton);
