// contains all the action creator functions
import { createAction } from "./action-helper";
import * as types from "./types";

export const actions = {
  startFetch: (type: string) => createAction(types.FETCH_START, type),
  endFetch: () => createAction(types.FETCH_END),
};
