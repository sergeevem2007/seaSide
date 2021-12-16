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

//модальное окно

const mainBurger = document.querySelector('.main__burger');
const modal = document.querySelector('.modal');
const modalBody = modal.querySelector('.modal__body');
const body = document.querySelector('body');

mainBurger.addEventListener('click', () => {
  body.classList.add('modal-open');
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  modalBody.style.marginLeft = "0";
});

modal.addEventListener('click', (event) => {
  if (!event.target.matches('.modal__body')) {
    modalBody.style.marginLeft = "-320px";
    setTimeout( () => {
      body.classList.remove('modal-open');
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";
    }, 350);  
  }
});

