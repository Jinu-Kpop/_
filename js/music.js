const audio = document.getElementById('bg-music');
const playPause = document.getElementById('playPause');
const volume = document.getElementById('volume');

// Example song list (replace with your Google Drive URLs or direct links)
const songs = [
  'https://drive.google.com/drive/folders/1NaMhVAtrKCwAkvRWqgUksfBSYDmZv-qM?usp=sharing'
];

let currentSong = 0;

function playMusic() {
  audio.src = songs[currentSong];
  audio.play();
}

playPause.addEventListener('click', () => {
  if (audio.paused) audio.play();
  else audio.pause();
});

volume.addEventListener('input', () => {
  audio.volume = volume.value;
});

playMusic();
