'use strict';

// проигрывание видео
const roomsVideo = document.querySelector('.rooms__video');
const roomsPlay = document.querySelector('.rooms__play');

roomsPlay.addEventListener('click', (event) => {
  event.preventDefault();
  roomsPlay.style.zIndex = "-1";
  roomsVideo.style.zIndex = "2";
  roomsVideo.play();
});
roomsVideo.addEventListener('ended', () => {
  roomsPlay.style.zIndex = "2";
  roomsVideo.style.zIndex = "-2";
});

//плавная прокурутка к якорным ссылкам
const anchors = document.querySelectorAll('a[href*="#"]');

for (let anchor of anchors) {
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    
    const blockID = anchor.getAttribute('href').substr(1);
    
    document.getElementById(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
};

