import * as React from "react";
import {
  Popup,
  Icon,
  Segment,
  TransitionablePortal,
  Header,
  Button,
  DropdownItemProps
} from "semantic-ui-react";
import { model, Actions } from "../../redux";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import "../../styles/modal.css";
import AddDMChannelForm from "../forms/AddDMChannelForm";
import { createChannel } from "../../redux/operations/operations";

const AddButton = (props: any) => (
  <Popup
    trigger={
      <Icon name="plus" style={{ float: "right" }} onClick={props.onClick} />
    }
    content="Start a new direct message"
    position="top center"
    inverted
    basic
    style={{ paddingTop: "3px", paddingBottom: "3px" }}
  />
);

interface Props extends DispatchProps, StateProps {
  users: model.User[];
}

interface State {
  visible: boolean;
  warning: string;
  value: string;
}

const initialState: State = {
  visible: false,
  warning: "",
  value: "",
};
class AddDMChannelButton extends React.Component<Props, State> {
  readonly state = initialState;

  submit = () => {
    this.setState({ warning: "" });
    (async () => {
      let args = { members: [this.state.value], type: 1} as any;
      let resp = await this.props.createChannel!(args);
      if (resp !== null) {
        this.setState({ warning: (resp as any) as string });
      } else {
        this.handleClose();
      }
    })();
  };

  handleChange = (e: any, { value }: any) => this.setState({ value } as any);

  handleOpen = () => this.setState({ visible: true });

  handleClose = () => this.setState(initialState);

  options = (): DropdownItemProps[] => {
    return this.props.users.map(u => {
      let image = {
      size:"mini",
      src:u.photoURL,
      }
      return { image, text: u.userName, value: u.id, key: u.id };
    })
  }

  render() {
    const { fetching } = this.props;
    const { visible, warning, value } = this.state;

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
              <Header size="huge">Direct Messages</Header>
              <AddDMChannelForm 
                count={fetching.count}
                warning={warning}
                submit={this.submit}
                handleChange={this.handleChange}
                options={this.options()}
                value={value}
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

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  ...bindActionCreators({ createChannel }, dispatch)
});

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(AddDMChannelButton);
