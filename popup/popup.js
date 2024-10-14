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
        dateHeader.className = 'date-header';
        videoList.appendChild(dateHeader);
  
        groupedVideos[date].forEach((video) => {
          const truncatedTitle = video.title.slice(0, 20); // 제목을 20자까지 자름
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = video.url;
          link.target = '_blank';
          link.addEventListener('click', (event) => {
            event.preventDefault(); 
            chrome.tabs.create({ url: video.url, active: false }); 
          });
          
          // 제목을 10자씩 줄바꿈하여 두 줄로 표시
          const firstLine = document.createElement('span');
          firstLine.textContent = truncatedTitle.slice(0, 10);
          const secondLine = document.createElement('span');
          secondLine.textContent = truncatedTitle.slice(10, 20);
  
          link.appendChild(firstLine);
          if (secondLine.textContent) {
            link.appendChild(secondLine);
          }
          listItem.appendChild(link);
          videoList.appendChild(listItem);
        });
      });
  
      console.log("Videos loaded:", result.videos); 
    });
});