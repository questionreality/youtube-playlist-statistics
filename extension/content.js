chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.to === "content") {
    const durationPlayed =
      document.querySelector(".html5-main-video").currentTime;
    console.log("durationPlayed", durationPlayed);
    // chrome.runtime.sendMessage(
    //   {
    //     from: "content",
    //     to: "popup",
    //     durationPlayed,
    //   },
    //   function (response) {
    //     console.log(response);
    //   }
    // );
    sendResponse({ durationPlayed });
  }
});
// const video = document.querySelector(".html5-main-video");
// const durationPlayed = video.currentTime;
// console.log(durationPlayed);
// chrome.runtime.sendMessage(durationPlayed, function (response) {
//   console.log(response);
// });
