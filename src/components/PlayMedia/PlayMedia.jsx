import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { selectPlayUrl } from "../../redux/play/play.selectors";
import "./PlayMedia.scss";

// Render a YouTube video player

const PlayMedia = () => {
  const media = useSelector(selectPlayUrl);
  console.log(media);
  return (
    <div>
      <ReactPlayer url={media} playing controls={true} width="100%" />
    </div>
  );
};

export default PlayMedia;
