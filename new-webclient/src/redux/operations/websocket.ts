import { Dispatch } from "react-redux";
import { Actions, model } from "..";
import { getToken } from "../util";
import { actions } from "../actions";

export const initiateWebSocketConnection = () => async (
  dispatch: Dispatch<Actions>,
  getState: () => model.StoreState
) => {
  try {
    const wsURL = `${process.env.REACT_APP_API_WS!}?auth=${getToken()!}`;
    dispatch(actions.initWSStart());
    const ws = new WebSocket(wsURL);
    dispatch(actions.initWSSuccess());

    ws.onmessage = (messageEvent: MessageEvent) =>
      processWSEvent(messageEvent, dispatch, getState);

    return null;
  } catch (err) {
    dispatch(actions.initWSError());
    console.warn(err.message);
    return err.message;
  }
};

function processWSEvent(
  messageEvent: MessageEvent,
  dispatch: Dispatch<Actions>,
  getState: () => model.StoreState
) {
  let event = JSON.parse(messageEvent.data);
  try {
    switch (event.type) {
      case "message":
        processMessageEvent(event, dispatch, getState);
        return;
      case "channel":
        processChannelEvent(event, dispatch, getState);
        return;
    }
  } catch (error) {
    console.warn(error.message);
  }
}

function processMessageEvent(
  event: any,
  dispatch: Dispatch<Actions>,
  getState: () => model.StoreState
) {
  try {
    switch (event.subtype) {
      case "update":
        dispatch(actions.wsMessageUpdate(event.message));
        return;
      case "delete":
        dispatch(actions.wsMessageDelete(event.message));
        return;
      case "new":
        dispatch(actions.wsMessageNew(event.message));
        return;
    }
  } catch (error) {
    console.warn(error.message);
  }
}

function processChannelEvent(
  event: any,
  dispatch: Dispatch<Actions>,
  getState: () => model.StoreState
) {
  try {
    switch (event.subtype) {
      case "update":
        dispatch(actions.wsChannelUpdate(event.channel));
        return;
      case "delete":
        let { currentChannel } = getState();
        dispatch(actions.wsChannelDelete(event.channel));
        if (currentChannel!.id === event.channel.id) {
          location.replace("/");
        }
        return;
      case "new":
        dispatch(actions.wsChannelNew(event.channel));
        return;
    }
  } catch (error) {
    console.warn(error.message);
  }
}
