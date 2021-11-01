import "./playStart.scss";
import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { TADUM_SOUND_URL } from "../../requests";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { selectPlayUrl } from "../../redux/play/play.selectors";

// Render a YouTube video player

const PlayStart = () => {
  const media = useSelector(selectPlayUrl);
  console.log(media);
  return (
    <div>
      <ReactPlayer url={media} playing controls={true} width="100%" />
    </div>
  );
};

export default PlayStart;
