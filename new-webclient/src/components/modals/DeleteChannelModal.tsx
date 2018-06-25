import * as React from "react";
import { Button, Modal, Message } from "semantic-ui-react";
import { Actions, model } from "../../redux";
import { deleteChannel, moveBackToGeneralChannel } from "../../redux/operations";
import { Dispatch, connect } from "react-redux";
import { bindActionCreators } from "redux";

interface State {
  visible: boolean;
  warning: string;
}

interface Props extends DispatchProps, StateProps {
  id: string;
}

class DeleteChannelButton extends React.Component<Props, State> {
  readonly state = {
    visible: false,
    warning: "",
  };

  show = () => this.setState({ visible: true });

  handleConfirm = () => {
    const { id } = this.props;
    (async () => {
      let resp = await this.props.deleteChannel!(id);
      if (resp !== null) {
        this.setState({ warning: (resp as any) as string });
      } else {
        // if succesful we don't need to force a visible update
        // because it will unmount itself. So we do nothing here
        // except for check if we are on that page. However, if 
        // we are on on the same page then the app will reload to
        // the home page "/".
      }
    })();
  }

  handleClose = () => this.setState({ visible: false });

  render() {
    const { visible, warning } = this.state;
    return (
      <React.Fragment>
        <Button onClick={this.show} inverted color="red" floated="right" size="tiny">
          DELETE
        </Button>
        <Modal
          open={visible}
          closeOnDimmerClick={false}
          onClose={this.handleClose}
          size="mini"
          dimmer
        >
          <Modal.Content>
            <p>This action cannot be <b>undone</b>. Are you sure you still want to delete this channel and all it's messages?</p>
            <Message warning hidden={warning.length === 0}>{warning}</Message>
          </Modal.Content>
          <Modal.Actions>
            <Button content="CANCEL" size="tiny" basic onClick={this.handleClose} />
            <Button content="CONFIRM" size="tiny" className="red" onClick={this.handleConfirm} />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

interface StateProps {
  currentchannel: model.Channel | null;
}

const mapStateToProps = (state: model.StoreState): StateProps => ({
  currentchannel: state.currentChannel,
});

interface DispatchProps {
  deleteChannel?: typeof deleteChannel;
  moveBackToGeneralChannel?: typeof moveBackToGeneralChannel;
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ deleteChannel, moveBackToGeneralChannel }, dispatch)
});

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(DeleteChannelButton);
