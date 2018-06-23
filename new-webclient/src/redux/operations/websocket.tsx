import { Dispatch } from "react-redux";
import { Actions } from "..";
import { getToken } from "../util";
import { actions } from "../actions";

export const initiateWebSocketConnection = () => async (
  dispatch: Dispatch<Actions>
) => {
  try {
    const wsURL = `${process.env.REACT_APP_API_WS!}?auth=${getToken()!}`;
    dispatch(actions.initWSStart())
    const ws = new WebSocket(wsURL);
    dispatch(actions.initWSSuccess())
    ws.addEventListener("message", event => {
      console.log(event);
      console.log(JSON.parse(event.data))
    })
  } catch (err) {
    dispatch(actions.initWSError())
    console.warn(err.message);
  }
};
