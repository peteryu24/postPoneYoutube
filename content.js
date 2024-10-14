chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getVideoTitle") {
      const { videoId } = request;
      console.log("Checking for video title for videoId:", videoId);
  
      // href 속성이 videoId를 포함하는 앵커 태그 찾기
      const videoElement = document.querySelector(`a[href*="watch?v=${videoId}"]`);
      if (videoElement) {
        // 해당 앵커 태그 내의 제목 요소를 찾기
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
    return true; // 비동기 sendResponse를 사용하기 위해 true 반환
  });