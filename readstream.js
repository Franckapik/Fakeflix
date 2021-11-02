var fs = require("fs"),
  http = require("http"),
  url = require("url"),
  path = require("path");

http
  .createServer(function (req, res) {
    if (req.url != "/movie.mp4") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end('<video src="http://localhost:8888/movie.mp4" controls></video>');
    } else {
      console.log(__dirname);
      var file = "public/series/Family.Guy.S15E07.VOSTFR.HDTV.x264.mkv.mp4";

      fs.stat(file, function (err, stats) {
        if (err) {
          if (err.code === "ENOENT") {
            // 404 Error if file not found
            return res.sendStatus(404);
          }
          res.end(err);
        }
        var range = req.headers.range;
        if (!range) {
          // 416 Wrong range
          return res.sendStatus(416);
        }
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = end - start + 1;

        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        });

        var stream = fs
          .createReadStream(file, { start: start, end: end })
          .on("open", function () {
            stream.pipe(res);
          })
          .on("error", function (err) {
            res.end(err);
          });
      });
    }
  })
  .listen(8888);
