chrome.runtime.onInstalled.addListener(() => {
    // context 메뉴 생성
    chrome.contextMenus.create({
      id: "addToPostPoneYoutube",
      title: "Add to postPoneYoutube",
      contexts: ["link", "page"], // 링크와 페이지 두 군데 모두 메뉴를 표시
      documentUrlPatterns: ["*://www.youtube.com/*"] // 유튜브 페이지에서만 활성화
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToPostPoneYoutube") {
      if (!info.linkUrl) {
        console.error("The selected item is not a video link.");
        return;
      }
  
      // videoId 추출
      const urlParams = new URLSearchParams(new URL(info.linkUrl).search);
      const videoId = urlParams.get('v');
  
      if (!videoId) {
        console.error("Invalid video URL or no video ID found.");
        return;
      }
  
      // content script 실행 후 메시지 전송
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error injecting content script:", chrome.runtime.lastError.message);
          return;
        }
  
        // content script가 로드된 후 메시지 보내기
        chrome.tabs.sendMessage(tab.id, { action: "getVideoTitle", videoId }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message to content script:", chrome.runtime.lastError.message);
            return;
          }
  
          const videoTitle = response?.title || "Unknown Title";
  
          chrome.storage.sync.get({ videos: [] }, (result) => {
            const videos = result.videos;
            videos.push({
              title: videoTitle,
              url: info.linkUrl,
              date: new Date().toISOString().split("T")[0] // 오늘 날짜
            });
  
            chrome.storage.sync.set({ videos }, () => {
              if (chrome.runtime.lastError) {
                console.error("Error saving to storage:", chrome.runtime.lastError.message);
              } else {
                console.log("Video saved successfully:", { title: videoTitle, url: info.linkUrl });
              }
            });
          });
        });
      });
    }
  });