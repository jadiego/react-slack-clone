import * as React from "react";
import { TextArea } from "semantic-ui-react";
import Scrollbars from "react-custom-scrollbars";
import { connect, Dispatch } from "react-redux";
import { Actions } from "../redux";
import { bindActionCreators } from "redux";
import { postMessage, hideMessageBar } from "../redux/operations";

interface Props extends DispatchProps {
  scrollToBottom: (behavior: ScrollBehavior) => void;
}

interface State {
  text: string;
}

class TextEditor extends React.Component<Props, State> {
  readonly state = {
    text: ""
  };

  handleChange = (e: any) => this.setState({ text: e.target.value });

  handleOnKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      let { text } = this.state;
      (async () => {
        if (text.trim().length === 0) {
          return;
        }
        let resp = await this.props.postMessage!(text);
        if (resp !== null) {
          setTimeout(() => {
            this.props.hideMessageBar!();
          }, 3000);
        } else {
          this.setState({ text: "" });
          this.props.scrollToBottom("smooth");
        }
      })();
    }
  };

  render() {
    return (
      <div id="textarea-container">
        <Scrollbars autoHeight autoHide autoHeightMax={200} autoHeightMin={36}>
          <TextArea
            autoHeight
            rows={1}
            value={this.state.text}
            onChange={this.handleChange}
            onKeyPress={this.handleOnKeyPress}
            placeholder="Remember, be nice!"
          />
        </Scrollbars>
      </div>
    );
  }
}

interface DispatchProps {
  postMessage?: typeof postMessage;
  hideMessageBar?: typeof hideMessageBar;
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  ...bindActionCreators({ postMessage, hideMessageBar }, dispatch)
});

export default connect<Props>(
  null,
  mapDispatchToProps
)(TextEditor);
