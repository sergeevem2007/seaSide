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