import { SemanticCOLORS } from "semantic-ui-react";

export interface StoreState {
  fetching: FetchState;
  messagebar: MessageBarState;
  currentUser: User | null;
  currentChannel: Channel | null;
  users: User[];
  channels: Channel[];
  messages: Message[];
}

export interface FetchState {
  count: number;
}
export const FetchInitialState = { count: 0 };

export interface MessageBarState {
  visible: boolean;
  color?: SemanticCOLORS;
  message?: string;
}
export const MessageBarInitialState = {
    visible: false,
}

export const MessagesInitialState: Message[] = [];

export const ChannelsInitialState = [];

export const UsersInitialState = [];

export const currentUser = null;

export const currentChannel = null;

export interface SignupFormArgs {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  passwordconf: string;
}

export interface NewChannelFormArgs {
  name: string,
  private: boolean,
  members: string[],
  description: string;
}

export interface User {
  id: string;
  userName: string;
  photoURL: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  creatorid: string;
  members: string[];
  private: boolean;
}

export interface Message {
  id: string;
  channelid: string;
  body: string;
  createdAt: string;
  creatorid: string;
  editedat: string;
}

export interface FormattedMessage {
  id: string;
  date: string;
  message: string;
  photoUrl: string;
  name: string;
}
