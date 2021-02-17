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

// Start the popup script, this could be anything from a simple script to a webapp
// const initPopupScript = () => {
//     // Access the background window object
//     const backgroundWindow = chrome.extension.getBackgroundPage();
//     // Do anything with the exposed variables from background.js
//     console.log(backgroundWindow.sampleBackgroundGlobal);

//     // This port enables a long-lived connection to in-content.js
//     let port = null;

//     // Send messages to the open port
//     const sendPortMessage = message => port.postMessage(message);

//     // Find the current active tab
//     const getTab = () =>
//         new Promise(resolve => {
//             chrome.tabs.query(
//                 {
//                     active: true,
//                     currentWindow: true
//                 },
//                 tabs => resolve(tabs[0])
//             );
//         });

//     // Handle port messages
//     const messageHandler = message => {
//         console.log('popup.js - received message:', message);
//     };

//     // Find the current active tab, then open a port to it
//     getTab().then(tab => {
//         // Connects to tab port to enable communication with inContent.js
//         port = chrome.tabs.connect(tab.id, { name: 'chrome-extension-template' });
//         // Set up the message listener
//         port.onMessage.addListener(messageHandler);
//         // Send a test message to in-content.js
//         sendPortMessage('Message from popup!');
//     });
// };
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
  fetch(`http://localhost:3000/youtube?url=${tab.url}`)
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";
      if (data.error) {
        errorText.innerText = `${data.error}`;
      } else {
        const { avg, count, total } = data;
        numberText.innerText = `Number of Videos: ${count}`;
        lengthText.innerText = `Total Length of Playlist: ${total}`;
        avgText.innerText = `Average Length of Video: ${avg}`;
      }
    })
    .catch((e) => console.log(e.message));
});

// // Fire scripts after page has loaded
// document.addEventListener('DOMContentLoaded', initPopupScript);
