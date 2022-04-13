/* background.js
 *
 * This file has an example of how to make variables accessible to other scripts of the extension.
 *
 * It also shows how to handle short lived messages from other scripts, in this case, from in-content.js
 *
 * Note that not all extensions need of a background.js file, but extensions that need to persist data after a popup has closed may need of it.
 */

// // A sample object that will be exposed further down and used on popup.js
// const sampleBackgroundGlobal = {
//     message: 'This object comes from background.js'
// };

// // Listen to short lived messages from in-content.js
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     // Perform any ther actions depending on the message
//     console.log('background.js - received message from in-content.js:', message);
//     // Respond message
//     sendResponse('👍');
// });

// // Make variables accessible from chrome.extension.getBackgroundPage()
// window.sampleBackgroundGlobal = sampleBackgroundGlobal;

// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: "youtube.*list=" },
          }),
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});
