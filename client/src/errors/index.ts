import { Actions } from "../redux";
import { Dispatch } from "redux";
import { actions } from "../redux/actions";

export const APIServerDownErrorMessage = "Something went wrong when attempting to fetch resource.";

export class APIServerDownError extends Error {
  constructor(...params: any[]) {
    super(...params);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIServerDownError);
    }

    this.message = APIServerDownErrorMessage;
  }
}

export class UserUnauthorizedError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserUnauthorizedError);
    }
    this.message = message;
  }
}

export function AppError(status: number, message: string): Error {
  console.warn(`|%c${status}%c| %c${message}`, "color: red;", "color: black;", "color: gray;");
  switch (status) {
    case 401:
      return new UserUnauthorizedError(message);
    default:
      return new Error(message);
  }
}

export function handleError(dispatch: Dispatch<Actions>, action: Actions, error: string): string {
  if (error === 'Failed to fetch') {
    dispatch(actions.apiServerDownError());
    return APIServerDownErrorMessage;
 } else {
   dispatch(action);
   return error;
 }
}
