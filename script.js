// Starfield
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let stars = Array(200).fill().map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  z: Math.random() * canvas.width
}));
function animateStars() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for (let s of stars) {
    s.z -= 2;
    if (s.z <= 0) s.z = canvas.width;
    const k = 128 / s.z;
    const px = s.x * k + canvas.width / 2;
    const py = s.y * k + canvas.height / 2;
    if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
      const size = (1 - s.z / canvas.width) * 2;
      ctx.fillStyle = "white";
      ctx.fillRect(px, py, size, size);
    }
  }
  requestAnimationFrame(animateStars);
}
animateStars();

// Music system
const player = new Audio();
let playlist = [];
let index = 0;

fetch("songs.json").then(r=>r.json()).then(data=>{
  playlist = data.songs;
  if(playlist.length === 1){
    player.src = playlist[0].url;
    player.loop = true;
    player.play();
    document.getElementById("songName").textContent = playlist[0].name;
  }
});

document.getElementById("playPause").addEventListener("click",()=>{
  if(player.paused){
    player.play();
    playPause.textContent = "⏸";
  } else {
    player.pause();
    playPause.textContent = "▶";
  }
});
document.getElementById("volume").addEventListener("input",e=>{
  player.volume = e.target.value;
});

// Fun modal & logo easter egg
const logo = document.getElementById("logo");
const modal = document.getElementById("funModal");
let clickCount = 0;
logo.addEventListener("click",()=>{
  clickCount++;
  if(clickCount === 5){
    new Audio("assets/jingle.mp3").play();
    modal.style.display = "flex";
    setTimeout(()=> modal.style.display="none", 3000);
    clickCount = 0;
  }
});
