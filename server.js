const express = require("express");
const app = express();
const port = 3001;
var glob = require("glob");
const fs = require("fs");
var ptn = require("parse-torrent-name");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const { REACT_APP_API_KEY } = process.env;

app.get("/save", (req, res) => {
  glob("*.?(mkv|avi|mp4)", { matchBase: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      console.log(files);
      var listObjFiles = [];
      files.forEach((file) => {
        const name = file.replace(/^.*[\\\/]/, "");
        const objFile = { ...ptn(name) };
        objFile.src = file.substr(file.indexOf("/") + 1);
        console.log(objFile.src);
        listObjFiles.push(objFile);
      });

      // a list of paths to javaScript files in the current working directory
      fs.writeFile("users.json", JSON.stringify(listObjFiles), (err) => {
        // Catch this!
        if (err) throw err;

        console.log("Users saved!");
      });
    }
  });
  res.send("Saved");
});

app.get("/rename", (req, res) => {
  glob("./public/series/**/*.mkv", (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        console.log(ptn(file));
      });
    }
  });
  res.send("Renamed");
});

app.get("/read", (req, res) => {
  fs.readFile("users.json", (err, data) => {
    // Catch this!
    if (err) throw err;
    const parsed = JSON.parse(data);
    console.log(parsed);
    res.json(parsed);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
