import axios from "axios";

//base de tous les url
const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export default instance;
