import { playTypes } from "./play.types";

export const playThisUrl = (url) => ({
  type: playTypes.PLAY,
  payload: url,
});
