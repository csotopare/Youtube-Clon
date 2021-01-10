const videoContainer = document.getElementById('jsVideoPlayer');
const videoPlayer = document.querySelector('#jsVideoPlayer video');
const playBtn = document.getElementById('jsPLayButton');
const volumeBtn = document.getElementById('jsVolumeButton');
const fullScreenBtn = document.getElementById('jsFullScreen');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const volumeRange = document.getElementById('jsVolume');
import getBlobDuration from 'get-blob-duration';

const registerView = () => {
   const videoId = window.location.href.split('/videos/')[1];
   fetch(`/api/${videoId}/view`, { method: 'POST' });
};

function handlePlayClick() {
   if (videoPlayer.paused) {
      videoPlayer.play();
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
   } else {
      videoPlayer.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
   }
}

function handleVolumeClick() {
   if (videoPlayer.muted) {
      videoPlayer.muted = false;
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      volumeRange.value = videoPlayer.volume;
   } else {
      volumeRange.value = 0;
      videoPlayer.muted = true;
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
   }
}

function goFullScreen() {
   if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
   } else {
      exitFullScreen();
   }
}

function exitFullScreen() {
   if (document.fullscreenElement) {
      document.exitFullscreen();
      fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
   }
}

const formatDate = (seconds) => {
   const secondsNumber = parseInt(seconds, 10);
   let hours = Math.floor(secondsNumber / 3600);
   let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
   let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

   if (hours < 10) {
      hours = `0${hours}`;
   }
   if (minutes < 10) {
      minutes = `0${minutes}`;
   }
   if (seconds < 10) {
      seconds = `0${seconds}`;
   }
   return `${hours}:${minutes}:${totalSeconds}`;
};
function getCurrentTime() {
   const CurrentTime = formatDate(Math.floor(videoPlayer.currentTime));
   currentTime.innerHTML = CurrentTime;
}

const setTotalTime = async () => {
   const blob = await fetch(
      `https://cors-anywhere.herokuapp.com/${videoPlayer.src}`
   ).then((response) => response.blob());
   const duration = await getBlobDuration(blob);
   const totalTimeString = formatDate(duration);
   totalTime.innerHTML = totalTimeString;
   setInterval(getCurrentTime, 1000);
};

function handleEnded() {
   registerView();
   videoPlayer.currentTime = 0;
   playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
   const {
      target: { value },
   } = event;
   videoPlayer.volume = value;
   if (value >= 0.7) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
   } else if (value >= 0.1) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
   } else {
      volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
   }
}

function init() {
   videoPlayer.volume = 0.5;
   playBtn.addEventListener('click', handlePlayClick);
   volumeBtn.addEventListener('click', handleVolumeClick);
   fullScreenBtn.addEventListener('click', goFullScreen);
   videoPlayer.addEventListener('loadedmetadata', setTotalTime);
   videoPlayer.addEventListener('ended', handleEnded);
   volumeRange.addEventListener('input', handleDrag);
}

if (videoContainer) {
   init();
}
