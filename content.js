chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getVideoTitle") {
      const { videoId } = request;
      console.log("Checking for video title for videoId:", videoId);
  
      const videoElement = document.querySelector(`a[href*="watch?v=${videoId}"]`);
      if (videoElement) {
        const titleElement = videoElement.closest('#dismissible').querySelector('#video-title');
        if (titleElement) {
          const videoTitle = titleElement.textContent.trim();
          console.log("Video title found:", videoTitle);
          sendResponse({ title: videoTitle });
          return;
        }
      }
  
      console.log("Video title not found.");
      sendResponse({ title: "Unknown Title" });
    }
    return true; 
  });