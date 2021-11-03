import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import useFetch from "use-http";
import axios from "../../axiosInstance";
import Credits from "../../components/Credits/Credits";
import Poster from "../../components/Poster/Poster";
import { defaultPageFadeInVariants, staggerHalf } from "../../motionUtils";
import requests from "../../requests";
import "./local.scss";

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const groupByArray = (xs, key) => {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r) => r && r.key === v);
    if (el) {
      el.values.push(x);
    } else {
      rv.push({ key: v, values: [x] });
    }
    return rv;
  }, []);
};

const Local = () => {
  const { data, loading } = useFetch("/read", []);
  const [LocalList, setLocalList] = useState([]);

  console.log(LocalList);

  useEffect(() => {
    console.log(groupByArray(LocalList, "id"));
  }, [LocalList]);

  useEffect(() => {
    if (data && data.length) {
      const arr = [];
      const prom = data.map((a) => {
        return axios
          .get(`${requests.fetchSearchQuery}${a.title}`)
          .then((response) => {
            if (response.data.results.length > 0) {
              const media = { ...response.data.results[0], ...a };
              return arr.push(media);
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
          groupByArray(LocalList, "id").map((a) => {
            if (a.values.length > 1) {
              //Series
              return (
                <Poster
                  key={a.key}
                  item={a.values[0]}
                  {...a.values[0]}
                  episodes={a.values}
                />
              );
            } else {
              //Movie
              return (
                <Poster
                  key={a.key}
                  item={a.values[0]}
                  {...a.values[0]}
                  episodes={false}
                />
              );
            }
          })}
      </motion.div>
      <Credits />
    </motion.div>
  );
};

export default Local;
