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

const numberText = document.querySelector(".number-text");
const lengthText = document.querySelector(".length-text");
const avgText = document.querySelector(".avg-text");
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
      if (data.error) {
        errorText.innerText = `${data.error}`;
      } else {
        const { avg, count, total } = data;
        numberText.innerText = `Number of Videos: ${count}`;
        lengthText.innerText = `Total Duration of Playlist: ${total}`;
        avgText.innerText = `Average Duration of Video: ${avg}`;
      }
    })
    .catch((e) => console.log(e.message));
});

// // Fire scripts after page has loaded
// document.addEventListener('DOMContentLoaded', initPopupScript);
