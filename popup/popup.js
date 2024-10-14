document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({ videos: [] }, (result) => {
      const videoList = document.getElementById('video-list');
      videoList.innerHTML = ''; 
      const groupedVideos = result.videos.reduce((acc, video) => {
        if (!acc[video.date]) {
          acc[video.date] = [];
        }
        acc[video.date].push(video);
        return acc;
      }, {});
  
      Object.keys(groupedVideos).forEach((date) => {
        const dateHeader = document.createElement('h3');
        dateHeader.textContent = date;
        videoList.appendChild(dateHeader);
  
        groupedVideos[date].forEach((video) => {
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = video.url;
          link.textContent = video.title;
          link.target = '_blank'; 
          link.addEventListener('click', (event) => {
            event.preventDefault(); 
            chrome.tabs.create({ url: video.url, active: false }); 
          });
          listItem.appendChild(link);
          videoList.appendChild(listItem);
        });
      });
  
      console.log("Videos loaded:", result.videos); 
    });
  });
  