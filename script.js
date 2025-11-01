// script.js - Cute Futuristic player, playlist loader, google-drive importer, achievements, local sign-in
// using ES module style (no external deps needed)

const stars = document.getElementById('stars');
const ctx = stars.getContext('2d');
let W = stars.width = innerWidth, H = stars.height = innerHeight;
let particles = [];
function initParticles(n = Math.round((W*H)/7000)) {
  particles = [];
  for (let i=0;i<n;i++) particles.push({x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.6+0.3, vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2, a: 0.5+Math.random()*0.6});
}
function resize(){ W = stars.width = innerWidth; H = stars.height = innerHeight; initParticles(); }
addEventListener('resize', resize);
function frame(){ ctx.clearRect(0,0,W,H); for(const p of particles){ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0; ctx.beginPath(); ctx.globalAlpha=p.a; ctx.fillStyle='#ffffff'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1; requestAnimationFrame(frame);}
initParticles(); frame();
function streak(){ const sx=Math.random()*W*0.7, sy=Math.random()*H*0.5, len=180+Math.random()*260; let prog=0; function f(){ ctx.beginPath(); const x=sx+prog*6, y=sy+prog*1.8; ctx.moveTo(x,y); ctx.lineTo(x-len*0.6,y-len*0.12); ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=1.2; ctx.stroke(); prog+=1; if(x<W+200 && y<H+200) requestAnimationFrame(f); } f(); }
setInterval(()=>{ if(Math.random()<0.45) streak(); }, 2000);

// theme
const themeBtn = document.getElementById('theme-toggle');
function setTheme(mode){ if(mode==='light'){ document.documentElement.classList.add('light'); document.body.classList.add('light'); localStorage.setItem('jk_theme','light'); themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>'; } else { document.documentElement.classList.remove('light'); document.body.classList.remove('light'); localStorage.setItem('jk_theme','dark'); themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>'; } }
setTheme(localStorage.getItem('jk_theme') || 'dark');
themeBtn.addEventListener('click', ()=> setTheme(document.body.classList.contains('light')? 'dark':'light'));

// elements
const logo = document.getElementById('logo');
const modal = document.getElementById('secret-modal');
const secretClose = document.getElementById('secret-close');

let logoClicks = 0;
const jingle = new Audio('assets/jingle.mp3'); jingle.crossOrigin='anonymous';
logo.addEventListener('click', ()=>{
  logoClicks++;
  if(logoClicks>=5){ modal.hidden=false; modal.setAttribute('aria-hidden','false'); try{ jingle.play(); }catch(e){} setTimeout(()=>{ modal.hidden=true; modal.setAttribute('aria-hidden','true'); },4200); logoClicks=0; }
  setTimeout(()=> logoClicks=0,3000);
});
secretClose.addEventListener('click', ()=>{ modal.hidden=true; modal.setAttribute('aria-hidden','true'); });

// Konami
const konami=[38,38,40,40,37,39,37,39,66,65]; let kp=0;
window.addEventListener('keydown', e=>{ if(e.keyCode === konami[kp]) kp++; else kp=0; if(kp===konami.length){ document.querySelector('.card').classList.add('ultra'); for(let i=0;i<12;i++) streak(); setTimeout(()=> document.querySelector('.card').classList.remove('ultra'),7000); kp=0; }});

// player elements
const player = document.getElementById('player');
const dragHandle = document.getElementById('drag-handle');
const playerTitle = document.getElementById('player-title');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const seek = document.getElementById('seek');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const vol = document.getElementById('volume');
const volUp = document.getElementById('vol-up');
const volDown = document.getElementById('vol-down');
const playlistEl = document.getElementById('playlist');
const importInput = document.getElementById('gdrive-input');
const importBtn = document.getElementById('import-gdrive');
const playerClose = document.getElementById('player-close');
const accountBtn = document.getElementById('account-btn');
const signin = document.getElementById('signin');
const signinName = document.getElementById('signin-name');
const signinSave = document.getElementById('signin-save');
const signinCancel = document.getElementById('signin-cancel');
const achList = document.getElementById('ach-list');
const claimAllBtn = document.getElementById('claim-all');

let audio = new Audio(); audio.crossOrigin='anonymous'; audio.volume = parseFloat(vol.value || 0.85);
let playlist = []; let current = 0;
let user = localStorage.getItem('jk_user') || null;
let achievements = JSON.parse(localStorage.getItem('jk_ach_'+(user||'guest')) || '[]');

// predefined achievements (at least 10)
const ACHS = [
  {id:'egg1', title:'First Glance', desc:'Open the site for the first time.'},
  {id:'egg2', title:'Star Gazer', desc:'Watch a shooting star.'},
  {id:'egg3', title:'Secret Finder', desc:'Find the Secret Fan Card.'},
  {id:'egg4', title:'Konami Master', desc:'Enter the Konami code.'},
  {id:'egg5', title:'Logo Lover', desc:'Click the logo 5 times.'},
  {id:'egg6', title:'Single Loop', desc:'Autoplayed the only song.'},
  {id:'egg7', title:'Playlist Curator', desc:'Import 3 songs.'},
  {id:'egg8', title:'Volume Pro', desc:'Set volume to 100%.'},
  {id:'egg9', title:'Traveler', desc:'Use the Drive importer.'},
  {id:'egg10', title:'Achiever', desc:'Claim all achievements.'}
];

// render achievements UI
function renderAch(){
  achList.innerHTML='';
  for(const a of ACHS){
    const el = document.createElement('div'); el.className='ach-item';
    const owned = achievements.includes(a.id);
    el.dataset.id=a.id;
    el.innerHTML = `${owned?'<i class="fa-solid fa-star"></i>':'<i class="fa-regular fa-star"></i>'} ${a.title}`;
    el.title = a.desc;
    el.onclick = ()=>{
      if(!owned){
        achievements.push(a.id); localStorage.setItem('jk_ach_'+(user||'guest'), JSON.stringify(achievements)); renderAch();
      }
    };
    achList.appendChild(el);
  }
}
renderAch();

// claim all
claimAllBtn.addEventListener('click', ()=>{ for(const a of ACHS) if(!achievements.includes(a.id)) achievements.push(a.id); localStorage.setItem('jk_ach_'+(user||'guest'), JSON.stringify(achievements)); renderAch(); alert('All achievements saved locally!');});

// sign-in (mock)
accountBtn.addEventListener('click', ()=>{ signin.hidden=false; signin.setAttribute('aria-hidden','false'); signinName.focus(); });
signinCancel.addEventListener('click', ()=>{ signin.hidden=true; signin.setAttribute('aria-hidden','true'); });
signinSave.addEventListener('click', ()=>{ const n = signinName.value.trim(); if(!n){ alert('Enter a username'); return; } user = n; localStorage.setItem('jk_user', user); // migrate existing achievements to this user
localStorage.setItem('jk_ach_'+user, JSON.stringify(achievements)); signin.hidden=true; renderAch(); alert('Signed in as '+user+' (achievements saved locally)'); });

// player show/hide
function showPlayer(){ player.hidden=false; player.setAttribute('aria-hidden','false'); }
function hidePlayer(){ player.hidden=true; player.setAttribute('aria-hidden','true'); }
playerClose.addEventListener('click', hidePlayer);

// draggable
(function(){
  let dragging=false, ox=0, oy=0;
  dragHandle.addEventListener('pointerdown', e=>{ dragging=true; const r=player.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top; player.setPointerCapture && player.setPointerCapture(e.pointerId); });
  window.addEventListener('pointermove', e=>{ if(!dragging) return; player.style.left = (e.clientX - ox)+'px'; player.style.top = (e.clientY - oy)+'px'; player.style.right='auto'; player.style.bottom='auto'; player.style.transform='none'; });
  window.addEventListener('pointerup', ()=> dragging=false);
})();

// playlist rendering
function renderPlaylist(){
  playlistEl.innerHTML='';
  playlist.forEach((s,i)=> {
    const it = document.createElement('div'); it.className='play-item';
    const meta = document.createElement('div'); meta.className='meta'; const t = document.createElement('div'); t.textContent = s.title || s.name || s.url.split('/').pop(); t.style.fontWeight='700';
    const u = document.createElement('div'); u.textContent = s.url; u.style.fontSize='12px'; u.style.opacity=0.6;
    meta.appendChild(t); meta.appendChild(u);
    const actions = document.createElement('div');
    const p = document.createElement('button'); p.className='small-btn'; p.textContent='Play'; p.onclick = ()=>{ loadTrack(i); playAudio(); };
    const d = document.createElement('button'); d.className='icon-btn'; d.innerHTML='<i class="fa-solid fa-trash"></i>'; d.onclick=()=>{ playlist.splice(i,1); saveState(); renderPlaylist(); if(playlist.length===0) hidePlayer();};
    actions.appendChild(p); actions.appendChild(d);
    it.appendChild(meta); it.appendChild(actions);
    playlistEl.appendChild(it);
  });
}

// save to local
function saveState(){ try{ localStorage.setItem('jk_playlist', JSON.stringify(playlist)); localStorage.setItem('jk_current', String(current)); }catch(e){} }

// load songs.json (if present) and local fallback
async function loadSongs(){
  try{
    const res = await fetch('songs.json', {cache:'no-store'});
    if(res.ok){
      const data = await res.json();
      if(Array.isArray(data) && data.length>0){ playlist = data.map(s=>({title:s.title||s.name||'', url:s.url})); }
      else if(typeof data === 'object' && data.gdrive_folder){ // optional support for a folder key - prompt user to import
        // show a note in import input
        importInput.placeholder = 'Paste drive file links (one per line) — folder detected';
      }
    }else{
      // fallback to localStorage
      playlist = JSON.parse(localStorage.getItem('jk_playlist')||'[]');
    }
  }catch(e){
    playlist = JSON.parse(localStorage.getItem('jk_playlist')||'[]');
  }
  if(playlist.length>0){ showPlayer(); renderPlaylist(); if(playlist.length===1){ loadTrack(0); tryAutoplay(); award('egg6'); } }
}
await loadSongs();

// helpers to extract Google Drive file id from share link
function gdToDirect(url){
  // detect /file/d/ID or id=... or open?id=...
  const m1 = url.match(/\\/file\\/d\\/([a-zA-Z0-9_-]{10,})/);
  if(m1) return `https://drive.google.com/uc?export=download&id=${m1[1]}`;
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if(m2) return `https://drive.google.com/uc?export=download&id=${m2[1]}`;
  // if it's the "open" link format with ?usp=sharing - try last path segment
  const m3 = url.match(/[-\w]{25,}/);
  if(m3) return `https://drive.google.com/uc?export=download&id=${m3[0]}`;
  return null;
}

// import button: paste many links (Drive share links) one per line
importBtn.addEventListener('click', ()=>{
  const text = importInput.value.trim();
  if(!text) return alert('Paste the Drive file links (one per line).');
  const lines = text.split(/\\r?\\n/).map(s=>s.trim()).filter(Boolean);
  let added = 0;
  for(const l of lines){
    const direct = gdToDirect(l);
    if(direct){
      playlist.push({title: l.split('/').pop().replace(/\?.*/,'') || 'Drive song', url: direct});
      added++;
    }
  }
  if(added>0){ saveState(); renderPlaylist(); showPlayer(); award('egg9'); alert('Imported '+added+' file(s)'); importInput.value=''; }
  else alert('Could not parse any Drive file links. Make sure you paste file share links (not folder link).');
});

// player mechanics
function loadTrack(i){
  if(!playlist[i]) return;
  current = i;
  audio.src = playlist[i].url;
  audio.loop = (playlist.length===1);
  playerTitle.textContent = playlist[i].title || playlist[i].name || playlist[i].url.split('/').pop();
  saveState();
}
async function playAudio(){ if(!audio.src) return; try{ await audio.play(); playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; }catch(e){ console.log('Autoplay blocked'); } }
function pauseAudio(){ audio.pause(); playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; }

playBtn.addEventListener('click', ()=>{ audio.paused ? playAudio() : pauseAudio(); });
prevBtn.addEventListener('click', ()=>{ if(!playlist.length) return; current = (current -1 + playlist.length) % playlist.length; loadTrack(current); playAudio(); });
nextBtn.addEventListener('click', ()=>{ if(!playlist.length) return; current = (current +1) % playlist.length; loadTrack(current); playAudio(); });

audio.addEventListener('timeupdate', ()=>{ if(isFinite(audio.duration) && audio.duration>0){ const p = (audio.currentTime / audio.duration) * 100; seek.value = Math.round(p); curTime.textContent = formatTime(audio.currentTime); durTime.textContent = formatTime(audio.duration); } });
seek.addEventListener('input', ()=>{ if(isFinite(audio.duration) && audio.duration>0) audio.currentTime = (seek.value/100)*audio.duration; });

vol.addEventListener('input', ()=>{ audio.volume = parseFloat(vol.value); if(audio.volume>=0.99) award('egg8'); });
volUp.addEventListener('click', ()=>{ audio.volume = Math.min(1, audio.volume+0.05); vol.value = audio.volume; if(audio.volume>=0.99) award('egg8'); });
volDown.addEventListener('click', ()=>{ audio.volume = Math.max(0, audio.volume-0.05); vol.value = audio.volume; });

audio.addEventListener('ended', ()=>{ if(playlist.length>1){ current = (current+1)%playlist.length; loadTrack(current); playAudio(); }});

// format time
function formatTime(s){ if(!isFinite(s)) return '0:00'; const m = Math.floor(s/60); const sec = Math.floor(s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }

// show saved playlist on load
renderPlaylist();
const storedCur = parseInt(localStorage.getItem('jk_current')||'0'); if(!isNaN(storedCur)) current = storedCur;
if(playlist.length>0 && playlist[current]) loadTrack(current);

// try autoplay when single
async function tryAutoplay(){ try{ await audio.play(); playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; award('egg6'); }catch(e){ console.log('Autoplay blocked'); } }

// if playlist empty, populate from localStorage (already handled earlier)
if(playlist.length===1) tryAutoplay();

// show player helper (expose global)
window.JK_ShowPlayer = ()=>{ showPlayer(); };

// award achievement (id)
function award(id){
  if(!ACHS.find(a=>a.id===id)) return;
  if(!achievements.includes(id)){ achievements.push(id); localStorage.setItem('jk_ach_'+(user||'guest'), JSON.stringify(achievements)); renderAch(); }
}
function renderAch(){ achList.innerHTML=''; for(const a of ACHS){ const el = document.createElement('div'); el.className='ach-item'; const owned = achievements.includes(a.id); el.innerHTML = `${owned?'<i class="fa-solid fa-star"></i>':'<i class="fa-regular fa-star"></i>'} ${a.title}`; el.title = a.desc; el.onclick = ()=>{ if(!owned){ achievements.push(a.id); localStorage.setItem('jk_ach_'+(user||'guest'), JSON.stringify(achievements)); renderAch(); alert('Achievement unlocked: '+a.title); } }; achList.appendChild(el); } }

// quick interactions that grant achievements
setTimeout(()=> award('egg1'), 1500); // First Glance
// detect shooting star: if streak happens, award egg2 (we can award randomly)
setInterval(()=>{ if(Math.random()<0.04) award('egg2'); }, 3000);

// import songs helper via global
window.JK_Add = function(obj){ if(!obj || !obj.url) return; playlist.push({title: obj.title||obj.name||obj.url.split('/').pop(), url: obj.url}); saveState(); renderPlaylist(); loadTrack(playlist.length-1); showPlayer(); };

// show player after user clicks "open" - for convenience show initially if playlist present
if(playlist.length>0) showPlayer();
