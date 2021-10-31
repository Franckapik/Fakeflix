import "./playStart.scss";
import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { TADUM_SOUND_URL } from "../../requests";
import ReactPlayer from "react-player";

// Render a YouTube video player

const PlayStart = () => {
  let history = useHistory();
  const soundRef = useRef(null);
  const handleTadum = () => {
    soundRef.current.currentTime = 0;
    soundRef.current.play();
  };

  return (
    <div>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
        playing
        controls
        width="100%"
      />
    </div>
  );
};

export default PlayStart;
