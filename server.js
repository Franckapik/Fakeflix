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
const hbjs = require("handbrake-js");
const path = require("path");

app.get("/convert", (req, res) => {
  glob("*.?(mkv|avi)", { matchBase: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      console.log(files);
      files.forEach((file) => {
        const name = file.replace(/^.*[\\\/]/, "");

        hbjs
          .spawn({ input: file, output: `${name}.mp4` })
          .on("error", (err) => {
            // invalid user input, no video found etc
          })
          .on("progress", (progress) => {
            console.log(
              "Percent complete: %s, ETA: %s",
              progress.percentComplete,
              progress.eta
            );
          });
      });
    }
  });
  res.send("Saved");
});

app.get("/video", function (req, res) {
  /*   const path = "public/series/s1/Family.Guy.S15E06.VOSTFR.HDTV.x264.mkv";
   */
  /*   const path = "public/series/American Dad!.S02E01.Camp Refoogee.avi.mp4";
   */ const path = "public/series/American Dad!.S02E01.Camp Refoogee.avi.mp4";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.get("/save", (req, res) => {
  glob("*.?(mkv|avi|mp4)", { matchBase: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
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
