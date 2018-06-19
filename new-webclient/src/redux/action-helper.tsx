import { actions } from "./actions";

interface Action<A extends string> {
  type: A;
}

interface ActionWithPayload<A extends string, P> extends Action<A> {
  payload: P;
}

export function createAction<A extends string>(type: A): Action<A>;
export function createAction<A extends string, P>(
  type: A,
  payload: P
): ActionWithPayload<A, P>;
export function createAction<A extends string, P>(type: A, payload?: P) {
  return payload === undefined ? { type } : { type, payload };
}

// action type used by reducer
type FunctionType = (...args: any[]) => any;
// tslint:disable-next-line:interface-over-type-literal
type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };
type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;
export type Actions = ActionsUnion<typeof actions>;
