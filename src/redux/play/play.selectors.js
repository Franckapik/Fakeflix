import { createSelector } from "reselect";

const selectPlay = (state) => state.playSel;

export const selectPlayUrl = createSelector(
  [selectPlay],
  (playSel) => playSel.playUrl
);
