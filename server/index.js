require("dotenv").config();
const cors = require("cors");
const express = require("express");
const axios = require("axios");
const moment = require("moment");
const app = express();
app.use(cors());
const port = 3000;
// const hostname = "localhost";
const URL1 = ({ id, key, page = "" }) =>
  `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken&key=${key}&playlistId=${id}&pageToken=${page}`;
const URL2 = (id, key) =>
  `https://www.googleapis.com/youtube/v3/videos?&part=contentDetails&id=${id}&key=${key}&fields=items/contentDetails/duration`;

// statistics, viewCount, likeCount

const apiKey = process.env.API_KEY;

const getId = (playlistLink) => {
  const pattern = /^([\S]+list=)?([\w_-]+)[\S]*$/;
  const match = playlistLink.match(pattern);
  console.log(match);
  console.log("id", match[2]);
  return match ? match[2] : "invalid playlist link";
};

// if I need to use multiple APIs:

// const findTimeSlice = () => {
//   let timeSlice = 0; //case 20<=hourNow<24
//   const hourNow = Date.now().getHours();
//   if (0 <= hourNow < 4) timeSlice = 1;
//   if (4 <= hourNow < 8) timeSlice = 2;
//   if (8 <= hourNow < 12) timeSlice = 3;
//   if (12 <= hourNow < 16) timeSlice = 4;
//   if (16 <= hourNow < 20) timeSlice = 5;
//   return timeSlice;
// };

const convertFromMilliseconds = (durationMilliseconds) => {
  const hours = moment.duration(durationMilliseconds).hours();
  const minutes = moment.duration(durationMilliseconds).minutes();
  const seconds = moment.duration(durationMilliseconds).seconds();
  let returnString = "";
  if (hours !== 0) {
    returnString = `${hours} hours, `;
  }
  if (minutes !== 0) {
    returnString += `${minutes} minutes, `;
  }
  returnString += `${seconds} seconds.`;

  return returnString;
};
app.get("/", (req, res) => {
  res.send("<h1>Youtube Playlist Statistics Extension</h1>");
});

app.get("/youtube", async (req, res) => {
  const playlistLink = req.query.url;
  // const playlistId = getId(playlistLink);
  let playlistID;
  if (req.query.list) {
    playlistId = req.query.list;
  } else {
    playlistId = getId(req.query.url);
  }
  if (playlistId === "WL") {
    return res.status(400).send({
      error: "This extension doesn't work for 'Watch Later' playlist.",
    });
  }
  if (playlistId === "LL") {
    return res.status(400).send({
      error: "This extension doesn't work for 'Liked Videos' playlist.",
    });
  }
  console.log("playlistID", playlistId);
  let nextPage = "";
  let count = 0;
  let time = 0;
  let durationSum = 0;
  let results;
  // tsl = findTimeSlice(),
  let returnObject = {};
  let trialCounter = 0;
  while (true) {
    vidList = [];
    trialCounter++;
    console.log(trialCounter);
    try {
      // console.log(URL1({ id: playlistId, key: apiKey, page: nextPage }));
      //make the first request (await)
      results = await axios.get(
        URL1({ id: playlistId, key: apiKey, page: nextPage })
      );
      results = results.data;
      console.log(results["items"]);
      results["items"].forEach((item) =>
        vidList.push(item["contentDetails"]["videoId"])
      );
    } catch (e) {
      console.log(e.message);
      returnObject = { error: "Playlist not found." };
      return res.status(404).send(returnObject);
    }
    urlList = vidList.join(",");
    count += vidList.length;

    try {
      let durations = await axios.get(URL2(urlList, apiKey));
      durations = durations.data.items;
      console.log(durations);
      durations.forEach((duration) => {
        console.log(duration);
        console.log(
          moment
            .duration(duration["contentDetails"]["duration"])
            .asMilliseconds()
        );
        durationSum += moment
          .duration(duration["contentDetails"]["duration"])
          .asMilliseconds();
      });
    } catch (e) {
      console.log(e.message);
    }
    if (results["nextPageToken"] && count < 500) {
      nextPage = results["nextPageToken"];
    } else {
      if (count >= 500) {
        returnObject = {
          error:
            "This extension doesn't work for playlists with more than 500 videos.",
        };
      } else {
        returnObject = {
          count: String(count),
          total: convertFromMilliseconds(durationSum),
          avg: convertFromMilliseconds(durationSum / count),
        };
        console.log(returnObject);
      }
      break;
    }
  }
  return res.send(returnObject);
});

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
