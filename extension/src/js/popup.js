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
  fetch(`${devUrl}/youtube?url=${tab.url}`)
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";
      container.style.display = "block";
      if (data.error) {
        errorText.innerText = `${data.error}`;
      } else {
        const {
          avg,
          count,
          total,
          timeLeft,
          timeCompleted,
          videoIndex,
          timeCompletedMilliseconds,
          totalMilliseconds,
        } = data;
        countText.innerText = `${videoIndex}/${count} videos`;
        avgText.innerText = `${avg} avg duration`;
        timeRemainingText.innerText = `${timeLeft} remaining`;
        timeCompletedText.innerText = `${timeCompleted}`;
        totalDurationText.innerText = `${total}`;
        console.log(data);
        progressBarCompleted.style.width = `${
          (timeCompletedMilliseconds / totalMilliseconds) * 360
        }px`;
      }
    })
    .catch((e) => console.log(e.message));
});

// // Fire scripts after page has loaded
// document.addEventListener('DOMContentLoaded', initPopupScript);
