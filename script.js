// script.js
// Cute Futuristic site: starfield, playlist loader, draggable bubble, easter eggs, light/dark

// ---------- starfield ----------
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
let stars = [];
function initStars(count = Math.round((W*H)/7000)) {
  stars = [];
  for (let i=0;i<count;i++){
    stars.push({x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.6+0.3, vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2, a: 0.5+Math.random()*0.6});
  }
}
function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; initStars(); }
addEventListener('resize', resize);
function draw(){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    s.x += s.vx;
    s.y += s.vy;
    if(s.x < 0) s.x = W; if(s.x > W) s.x = 0;
    if(s.y < 0) s.y = H; if(s.y > H) s.y = 0;
    ctx.beginPath();
    ctx.globalAlpha = s.a;
    ctx.fillStyle = '#ffffff';
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}
initStars();
draw();

// occasional streaks
function streak(){
  const sx = Math.random()*W*0.7;
  const sy = Math.random()*H*0.5;
  const len = 180+Math.random()*260;
  let progress = 0;
  function f(){
    ctx.beginPath();
    const x = sx + progress*6;
    const y = sy + progress*1.8;
    ctx.moveTo(x,y);
    ctx.lineTo(x-len*0.6, y-len*0.12);
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    progress += 1;
    if(x < W+200 && y < H+200) requestAnimationFrame(f);
  }
  f();
}
setInterval(()=>{ if(Math.random()<0.45) streak(); }, 2000);

// ---------- theme ----------
const themeBtn = document.getElementById('theme-toggle');
function setTheme(mode){
  if(mode === 'light'){ document.documentElement.classList.add('light'); document.body.classList.add('light'); localStorage.setItem('jk_theme','light'); themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>'; }
  else { document.documentElement.classList.remove('light'); document.body.classList.remove('light'); localStorage.setItem('jk_theme','dark'); themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>'; }
}
setTheme(localStorage.getItem('jk_theme') || 'dark');
themeBtn.addEventListener('click', ()=> setTheme(document.body.classList.contains('light') ? 'dark' : 'light'));

// ---------- playlist loader ----------
let playlist = [];
async function loadPlaylist(){
  try{
    // fetch songs.json from same origin (GitHub Pages root)
    const res = await fetch('songs.json', {cache: 'no-store'});
    if(!res.ok) throw new Error('songs.json not found');
    playlist = await res.json();
  }catch(e){
    console.warn('Could not fetch songs.json:', e);
    // fallback: try localStorage saved playlist
    try{ playlist = JSON.parse(localStorage.getItem('jk_playlist') || '[]'); } catch { playlist = []; }
  }

  if(!Array.isArray(playlist)) playlist = [];

  if(playlist.length > 0) {
    showBubble();
    if(playlist.length === 1){
      loadTrack(0);
      tryAutoplay();
    } else {
      // don't autoplay multi tracks
    }
  }
}
await loadPlaylist();

// ---------- audio & bubble ----------
const bubble = document.getElementById('bubble');
const songName = document.getElementById('song-name');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volSlider = document.getElementById('vol');
const volUp = document.getElementById('vol-up');
const volDown = document.getElementById('vol-down');
const bubbleClose = document.getElementById('bubble-close');

let audio = new Audio();
audio.crossOrigin = 'anonymous';
audio.volume = parseFloat(volSlider.value || 0.85);
let current = 0;

function showBubble(){ bubble.hidden = false; bubble.setAttribute('aria-hidden','false'); }
function hideBubble(){ bubble.hidden = true; bubble.setAttribute('aria-hidden','true'); }

function loadTrack(i){
  if(!playlist[i]) return;
  current = i;
  audio.src = playlist[i].url;
  audio.loop = (playlist.length === 1);
  songName.textContent = playlist[i].title || playlist[i].name || playlist[i].url.split('/').pop();
  // save last playlist
  try{ localStorage.setItem('jk_playlist', JSON.stringify(playlist)); localStorage.setItem('jk_current', String(current)); } catch(e){/* ignore */}
}

async function playAudio(){
  if(!audio.src) return;
  try{
    await audio.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }catch(e){
    console.log('Autoplay prevented:', e);
  }
}
function pauseAudio(){ audio.pause(); playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; }

playBtn.addEventListener('click', ()=>{ audio.paused ? playAudio() : pauseAudio(); });
prevBtn.addEventListener('click', ()=>{ if(!playlist.length) return; current = (current - 1 + playlist.length) % playlist.length; loadTrack(current); playAudio(); });
nextBtn.addEventListener('click', ()=>{ if(!playlist.length) return; current = (current + 1) % playlist.length; loadTrack(current); playAudio(); });

volSlider.addEventListener('input', ()=>{ audio.volume = parseFloat(volSlider.value); });
volUp.addEventListener('click', ()=>{ audio.volume = Math.min(1, audio.volume + 0.05); volSlider.value = audio.volume; });
volDown.addEventListener('click', ()=>{ audio.volume = Math.max(0, audio.volume - 0.05); volSlider.value = audio.volume; });

bubbleClose.addEventListener('click', ()=> hideBubble());

audio.addEventListener('ended', ()=> {
  if(playlist.length > 1){
    current = (current + 1) % playlist.length;
    loadTrack(current);
    playAudio();
  } // if only one song, audio.loop = true prevents ended event repeat need
});

// if a stored current exists, load it
const storedCur = parseInt(localStorage.getItem('jk_current') || '0');
if(!isNaN(storedCur)) current = storedCur;
if(playlist.length > 0 && playlist[current]) loadTrack(current);

// attempt autoplay helper
async function tryAutoplay(){ try{ await audio.play(); playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; } catch(e) { console.log('Autoplay blocked by browser'); } }

// ---------- draggable bubble ----------
(function makeDraggable(){
  const handle = document.getElementById('drag-handle');
  let dragging = false, offsetX = 0, offsetY = 0;
  handle.addEventListener('pointerdown', (e) => {
    dragging = true;
    const rect = bubble.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    bubble.setPointerCapture && bubble.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', (e) => {
    if(!dragging) return;
    bubble.style.left = (e.clientX - offsetX) + 'px';
    bubble.style.top = (e.clientY - offsetY) + 'px';
    bubble.style.right = 'auto';
    bubble.style.bottom = 'auto';
    bubble.style.transform = 'none';
  });
  window.addEventListener('pointerup', () => dragging = false);
})();

// ---------- easter eggs: logo click 5x and secret modal ----------
const logo = document.getElementById('logo');
const secret = document.getElementById('secret');
const secretClose = document.getElementById('secret-close');
let logoClicks = 0;
const jingle = new Audio('assets/jingle.mp3');
jingle.crossOrigin = 'anonymous';
logo.addEventListener('click', ()=>{
  logoClicks++;
  if(logoClicks >= 5){
    secret.hidden = false; secret.setAttribute('aria-hidden','false');
    try{ jingle.play(); }catch(e){ /* browser may block autoplay */ }
    setTimeout(()=>{ secret.hidden = true; secret.setAttribute('aria-hidden','true'); }, 4500);
    logoClicks = 0;
  }
  setTimeout(()=>{ logoClicks = 0; }, 3000);
});
secretClose.addEventListener('click', ()=>{ secret.hidden = true; secret.setAttribute('aria-hidden','true'); });

// ---------- Konami Code (Ultra neon) ----------
const konami = [38,38,40,40,37,39,37,39,66,65];
let kpos = 0;
window.addEventListener('keydown', (e)=>{
  if(e.keyCode === konami[kpos]) kpos++; else kpos = 0;
  if(kpos === konami.length){
    document.querySelector('.card').classList.add('ultra');
    for(let i=0;i<12;i++) streak();
    setTimeout(()=> document.querySelector('.card').classList.remove('ultra'), 7000);
    kpos = 0;
  }
});

// ---------- keyboard shortcut M toggles play/pause ----------
window.addEventListener('keydown', (e)=>{ if(e.key && e.key.toLowerCase() === 'm'){ if(!bubble.hidden){ audio.paused ? playAudio() : pauseAudio(); } } });

// ---------- show bubble function (exposed) ----------
window.JK_ShowPlayer = function(){ showBubble(); };

// optional helper to add a song via console:
// JK_Add({title:'Name', url:'https://raw.../song.mp3'})
window.JK_Add = function(obj){
  if(!obj || !obj.url) return;
  playlist.push({title: obj.title || obj.name || obj.url.split('/').pop(), url: obj.url});
  localStorage.setItem('jk_playlist', JSON.stringify(playlist));
  loadTrack(playlist.length - 1);
  showBubble();
};
