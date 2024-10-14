chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "addToPostPoneYoutube",
      title: "Add to postPoneYoutube",
      contexts: ["link", "page"], 
      documentUrlPatterns: ["*://www.youtube.com/*"] 
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToPostPoneYoutube") {
      if (!info.linkUrl) {
        console.error("The selected item is not a video link.");
        return;
      }
  
      const urlParams = new URLSearchParams(new URL(info.linkUrl).search);
      const videoId = urlParams.get('v');
  
      if (!videoId) {
        console.error("Invalid video URL or no video ID found.");
        return;
      }
  
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
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] 
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
    }
  });