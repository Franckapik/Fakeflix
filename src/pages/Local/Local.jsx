import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import useFetch from "use-http";
import axios from "../../axiosInstance";
import Credits from "../../components/Credits/Credits";
import Poster from "../../components/Poster/Poster";
import { defaultPageFadeInVariants, staggerHalf } from "../../motionUtils";
import requests from "../../requests";
import "./local.scss";

const groupSeries = (array) => {
  return array.reduce((r, v, i, a) => {
    if (v === a[i - 1]) {
      r[r.length - 1].push(v);
    } else {
      r.push(v === a[i + 1] ? [v] : v);
    }
    return r;
  }, []);
};

const Local = () => {
  const { data, loading } = useFetch("/read", []);
  const [LocalList, setLocalList] = useState([]);

  console.log(LocalList);

  useEffect(() => {
    if (data && data.length) {
      const arr = [];
      const prom = data.map((a) => {
        return axios
          .get(`${requests.fetchSearchQuery}${a.title}`)
          .then((response) => {
            if (arr.some((e) => e.id === response.data.results[0].id)) {
              //do nothing
            } else {
              return arr.push(response.data.results[0]);
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
      Promise.all(prom).then((data) => setLocalList(arr));
    }
  }, [data]); //promises could be used with all return elements ? Or map is returning something?

  return (
    <motion.div
      className="Local"
      variants={defaultPageFadeInVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="Local__wrp"
        variants={staggerHalf}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {LocalList && LocalList.length > 0 && (
          <h2 className="Local__title">Local</h2>
        )}
        {LocalList &&
          LocalList.length &&
          LocalList.map((a) => {
            return <Poster key={a.id} item={a} {...a} />;
          })}

        {[...new Set(LocalList)].map((a, i) => {
          return <li key={i}>{a.id}</li>;
        })}
      </motion.div>
      <Credits />
    </motion.div>
  );
};

export default Local;
