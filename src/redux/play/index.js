import { playTypes } from "./play.types";

const initialState = {
  isPlayed: false,
  playUrl: "",
};

const playReducer = (state = initialState, action) => {
  switch (action.type) {
    case playTypes.PLAY:
      return {
        ...state,
        isPlayed: true,
        playUrl: action.payload,
      };
    default:
      return state;
  }
};

export default playReducer;
