const express = require("express");
const app = express();
const port = 3001;
var glob = require("glob");
const fs = require("fs");
var ptn = require("parse-torrent-name");

const TorrentSearchApi = require("torrent-search-api");

TorrentSearchApi.enableProvider('Torrent9');
/* TorrentSearchApi.enableProvider('Torrent9');
TorrentSearchApi.enableProvider('ThePirateBay');
 */
/* const OS = require("opensubtitles-api");
const OpenSubtitles = new OS({
  useragent: "UserAgent",
  username: "franckapik",
  password: "Fanch/448g7doh3k",
  ssl: true,
}); */

app.get("/save", (req, res) => {
  glob("*.?(mkv|mp4|m4v)", { matchBase: true }, (err, files) => {
    var listObjFiles = [];

    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        //remove space in filename
        if (/\s/.test(file)) {
          console.log("rename :" + file);
          fs.rename(file, file.replace(/\s/g, "."), function (err) {
            if (err) console.log("Rename error: " + err);
          });
        }

        //remove path and extension
        const name = file.replace(/^.*[\\\/]/, "").replace(/\.[^/.]+$/, ".");
        const objFile = { ...ptn(name) };
        objFile.src = file.substr(file.indexOf("/") + 1);
        listObjFiles.push(objFile);
      });

      //write in json file
      fs.writeFile("users.json", JSON.stringify(listObjFiles), (err) => {
        if (err) throw err;
      });
    }
    res.send(listObjFiles);
  });
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

app.get("/torrentSearch", async (req, res) => {
  console.log(req.query.title, req.query.category);
  TorrentSearchApi
  .search(req.query.title, 'Movies', 20)
  .then(data => {res.json(data)
  
    TorrentSearchApi.downloadTorrent(data[0], __dirname + `/public/torrents/${data[0].title}.torrent`).then(success => {
      console.log('downloaded');
  } ) 
  
  })


 });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
