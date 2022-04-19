/* popup.js
 *
 * This file initializes its scripts after the popup has loaded.
 *
 * It shows how to access global variables from background.js.
 * Note that getViews could be used instead to access other scripts.
 *
 * A port to the active tab is open to send messages to its in-content.js script.
 *
 */
const convertFromMilliseconds = (durationMilliseconds) => {
  const days = moment.duration(durationMilliseconds).days();
  const hours = moment.duration(durationMilliseconds).hours();
  const minutes = moment.duration(durationMilliseconds).minutes();
  const seconds = moment.duration(durationMilliseconds).seconds();
  let returnString = "";
  if (hours !== 0) {
    returnString = `${days * 24 + hours}h `;
  }
  if (minutes !== 0) {
    returnString += `${minutes}m `;
  }
  if (returnString === "") {
    returnString += `${seconds ?? 0}s`;
  }

  return returnString;
};

const prodUrl = "https://youtube-playlist-statistics.herokuapp.com";
const devUrl = "http://localhost:3000";

const container = document.querySelector(".container");
const countText = document.querySelector(".video-count");
const avgText = document.querySelector(".video-avg");
const timeRemainingText = document.querySelector(".time-remaining");
const progressBarCompleted = document.querySelector(".progress-bar-completed");
const progressBarTotal = document.querySelector(".progress-bar-total");
const timeCompletedText = document.querySelector(".time-completed");
const totalDurationText = document.querySelector(".total-duration");

const errorText = document.querySelector(".error-text");
const loader = document.querySelector(".loader");
let durationPlayedMilliseconds = 0;

const getTab = () =>
  new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => resolve(tabs[0])
    );
  });
getTab().then((tab) => {
  console.log(tab.url);

  chrome.tabs.sendMessage(
    tab.id,
    { from: "popup", to: "content" },
    function (response) {
      console.log("message received from content page", response);

      durationPlayedMilliseconds = (response?.durationPlayed ?? 0) * 1000;
    }
  );

  fetch(`${devUrl}/youtube?url=${tab.url}`)
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";

      if (data.error) {
        errorText.innerText = `${data.error}`;
      } else {
        container.style.display = "block";
        const {
          count,
          videoIndex,
          timeCompletedMilliseconds,
          totalMilliseconds,
        } = data;
        const total = convertFromMilliseconds(totalMilliseconds);
        const avg = convertFromMilliseconds(totalMilliseconds / count);
        const timeLeft = convertFromMilliseconds(
          totalMilliseconds -
            (timeCompletedMilliseconds + durationPlayedMilliseconds)
        );
        const timeCompleted = convertFromMilliseconds(
          timeCompletedMilliseconds + durationPlayedMilliseconds
        );

        countText.innerText = `${videoIndex}/${count} videos`;
        avgText.innerText = `${avg} avg duration`;
        timeRemainingText.innerText = `${timeLeft} remaining`;
        timeCompletedText.innerText = `${timeCompleted}`;
        totalDurationText.innerText = `${total}`;
        progressBarCompleted.style.width = `${
          ((timeCompletedMilliseconds + durationPlayedMilliseconds) /
            totalMilliseconds) *
          360
        }px`;

        console.log(progressBarCompleted.style.width);
      }
    })
    .catch((e) => console.log(e.message));
});

// // Fire scripts after page has loaded
// document.addEventListener('DOMContentLoaded', initPopupScript);
