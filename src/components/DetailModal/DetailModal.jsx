import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlay, FaPlus } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import {
  modalFadeInUpVariants,
  modalOverlayVariants,
  modalVariants,
  staggerOne,
} from "../../motionUtils";
import {
  addToFavourites,
  removeFromFavourites,
} from "../../redux/favourites/favourites.actions";
import { hideModalDetail } from "../../redux/modal/modal.actions";
import {
  selectModalContent,
  selectModalState,
} from "../../redux/modal/modal.selectors";
import { BASE_IMG_URL, FALLBACK_IMG_URL } from "../../requests";
import { capitalizeFirstLetter, dateToYearOnly } from "../../utils";
import "./detailModal.scss";
import "../Poster/poster.scss";
import { playThisUrl } from "../../redux/play/play.actions";

const { REACT_APP_API_KEY } = process.env;
export const LANG = "fr-FR";

const TorrentList = ({ title }) => {
  const [torrents, setTorrents] = useState([]);

  useEffect(() => {
    axios
      .get(`/torrentSearch?title=${title}&category=Movie`)
      .then((res) => {
        if (res.data.length) {
          setTorrents(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [title]);

  return (
    <div>
      {torrents.length ? (
        <ul>
          {torrents && torrents.map((a, i) => <li key={i}>{a.title}</li>)}
        </ul>
      ) : (
        "Pas de torrents"
      )}
    </div>
  );
};

const DetailModal = () => {
  const dispatch = useDispatch();
  const modalClosed = useSelector(selectModalState);
  const modalContent = useSelector(selectModalContent);
  const handleModalClose = () => dispatch(hideModalDetail());
  const {
    overview,
    fallbackTitle,
    backdrop_path,
    release_date,
    first_air_date,
    vote_average,
    original_language,
    adult,
    genresConverted,
    isFavourite,
    episodes,
  } = modalContent;
  const joinedGenres = genresConverted
    ? genresConverted.join(", ")
    : "Not available";
  const maturityRating =
    adult === undefined
      ? "Not available"
      : adult
      ? "Suitable for adults only"
      : "Suitable for all ages";
  const reducedDate = release_date
    ? dateToYearOnly(release_date)
    : first_air_date
    ? dateToYearOnly(first_air_date)
    : "Not Available";
  const modalRef = useRef();

  const [episodeState, setEpisode] = useState([]);

  function compare(a, b) {
    if (a.episode_number < b.episode_number) {
      return -1;
    }
    if (a.episode_number > b.episode_number) {
      return 1;
    }
    return 0;
  }
  useEffect(() => {
    if (episodes) {
      const arr = [];
      const prom = episodes.map((a) => {
        return axios
          .get(
            `https://api.themoviedb.org/3/tv/${a.id}/season/${a.season}/episode/${a.episode}?api_key=${REACT_APP_API_KEY}&language=${LANG}&sort_by=air_date`
          )
          .then((response) => {
            const episodeInfo = { ...response.data };
            episodeInfo.src = a.src;
            return arr.push(episodeInfo);
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
      Promise.all(prom).then((data) => setEpisode(arr.sort(compare)));
    }
  }, [episodes]);

  const handleAdd = (event) => {
    event.stopPropagation();
    dispatch(addToFavourites({ ...modalContent, isFavourite }));
  };
  const handleRemove = (event) => {
    event.stopPropagation();
    dispatch(removeFromFavourites({ ...modalContent, isFavourite }));
    if (!modalClosed) handleModalClose();
  };
  const handlePlayAnimation = (event) => {
    event.stopPropagation();
    handleModalClose();
  };

  const handlePlayAction = (src) => {
    console.log(src);
    if (!modalClosed) handleModalClose();
    dispatch(playThisUrl(src));
  };

  useOutsideClick(modalRef, () => {
    if (!modalClosed) handleModalClose();
  });

  console.log(episodeState);

  return (
    <AnimatePresence exitBeforeEnter>
      {!modalClosed && (
        <>
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            key="modalOverlay"
            className={`Modal__overlay ${modalClosed && "Modal__invisible"}`}
          >
            <motion.div
              key="modal"
              variants={modalVariants}
              ref={modalRef}
              className={`Modal__wrp ${modalClosed && "Modal__invisible"}`}
            >
              <motion.button
                className="Modal__closebtn"
                onClick={handleModalClose}
              >
                <VscChromeClose />
              </motion.button>
              <div className="Modal__image--wrp">
                <div className="Modal__image--shadow" />
                <img
                  className="Modal__image--img"
                  src={
                    backdrop_path
                      ? `${BASE_IMG_URL}/${backdrop_path}`
                      : FALLBACK_IMG_URL
                  }
                  alt={fallbackTitle}
                />
                <div className="Modal__image--buttonswrp">
                  <Link
                    className="Modal__image--button"
                    onClick={handlePlayAnimation}
                    to={"/play"}
                  >
                    <FaPlay />
                    <span>Play</span>
                  </Link>
                  {!isFavourite ? (
                    <button
                      className="Modal__image--button-circular"
                      onClick={handleAdd}
                    >
                      <FaPlus />
                    </button>
                  ) : (
                    <button
                      className="Modal__image--button-circular"
                      onClick={handleRemove}
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              </div>
              <motion.div
                variants={staggerOne}
                initial="initial"
                animate="animate"
                exit="exit"
                className="Modal__info--wrp"
              >
                <motion.h3
                  variants={modalFadeInUpVariants}
                  className="Modal__info--title"
                >
                  {fallbackTitle}
                </motion.h3>
                <motion.p
                  variants={modalFadeInUpVariants}
                  className="Modal__info--description"
                >
                  {overview}
                </motion.p>
                <br></br>
                {episodes && episodeState ? (
                  <>
                    <motion.h4
                      variants={modalFadeInUpVariants}
                      className="Modal__info--otherTitle"
                    >
                      <b> Episodes</b>
                    </motion.h4>
                    <motion.hr
                      variants={modalFadeInUpVariants}
                      className="Modal__info--line"
                    />
                    <>
                      {episodeState.map((a, i) => (
                        <Link
                          key={i}
                          style={{ textDecoration: "none", color: "#f2f2f2" }}
                          onClick={() => handlePlayAction(a.src)}
                          to={"/play"}
                        >
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              paddingBottom: "20px",
                              paddingTop: "10px",
                              marginBottom: "10px",
                              borderBottom: "1px solid grey",
                            }}
                          >
                            <span
                              style={{
                                marginRight: "20px",
                                fontSize: "2em",
                                color: "grey",
                              }}
                            >
                              {a.episode_number}
                            </span>
                            <img
                              style={{ width: "150px", marginRight: "20px" }}
                              src={
                                "https://image.tmdb.org/t/p/original" +
                                a.still_path
                              }
                            />
                            <div>
                              <motion.h4
                                variants={modalFadeInUpVariants}
                                className="Modal__info--otherTitle"
                              >
                                {a.name}
                              </motion.h4>
                              <p style={{ fontSize: "0.8em" }}>{a.overview}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </>
                  </>
                ) : null}

                <motion.h4
                  variants={modalFadeInUpVariants}
                  className="Modal__info--otherTitle"
                >
                  Info sur <b>{fallbackTitle}</b>
                </motion.h4>
                <motion.div
                  variants={modalFadeInUpVariants}
                  className="Modal__info--row"
                >
                  <span className="Modal__info--row-label">Genres: </span>
                  <span className="Modal__info--row-description">
                    {joinedGenres}
                  </span>
                </motion.div>
                <motion.div
                  variants={modalFadeInUpVariants}
                  className="Modal__info--row"
                >
                  <span className="Modal__info--row-label">
                    {release_date ? "Release date: " : "First air date: "}
                  </span>
                  <span className="Modal__info--row-description">
                    {reducedDate}
                  </span>
                </motion.div>
                <motion.div
                  variants={modalFadeInUpVariants}
                  className="Modal__info--row"
                >
                  <span className="Modal__info--row-label">Average vote: </span>
                  <span className="Modal__info--row-description">
                    {vote_average || "Not available"}
                  </span>
                </motion.div>
                <motion.div
                  variants={modalFadeInUpVariants}
                  className="Modal__info--row"
                >
                  <span className="Modal__info--row-label">
                    Original language:{" "}
                  </span>
                  <span className="Modal__info--row-description">
                    {capitalizeFirstLetter(original_language)}
                  </span>
                </motion.div>
                <motion.div
                  variants={modalFadeInUpVariants}
                  className="Modal__info--row"
                >
                  <span className="Modal__info--row-label">
                    Age classification:{" "}
                  </span>
                  <span className="Modal__info--row-description">
                    {maturityRating}
                  </span>
                </motion.div>
                <TorrentList title={fallbackTitle}></TorrentList>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
