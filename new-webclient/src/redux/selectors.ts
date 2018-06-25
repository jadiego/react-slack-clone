import { Channel } from "./models";

export function ChannelWithName(channels: Channel[], name: string): Channel | null {
  let channel = channels.find((chan) => chan.name === name);
  if (channel) {
    return channel
  }
  return null;
}

export function ChannelWithID(channels: Channel[], id: string): Channel | null {
  let channel = channels.find((chan) => chan.id === id);
  if (channel) {
    return channel
  }
  return null;
}
