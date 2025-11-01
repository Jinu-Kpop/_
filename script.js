<!-- FILE: script.js -->
// init theme
setTheme(localStorage.getItem('jk_theme')||'dark');
themeToggle.addEventListener('click', ()=>{ setTheme(document.body.classList.contains('light')? 'dark':'light'); });


// Music controls
const musicPanel = document.getElementById('music-controls');
const spotifyEmbed = document.getElementById('spotify-embed');
const spotifyLinkInput = document.getElementById('spotify-link');
const customAudioInput = document.getElementById('custom-audio-link');
const customAudio = document.getElementById('custom-audio');
const playPause = document.getElementById('play-pause');
const musicToggleBtn = document.getElementById('music-toggle');


// initialize embed
const defaultEmbed = musicPanel.dataset.spotify;
function applySpotifyLink(link){
// try to normalize share links to embed URL
if(!link) { spotifyEmbed.src = defaultEmbed; spotifyEmbed.style.display = 'block'; customAudio.style.display = 'none'; return; }
if(link.includes('open.spotify.com')){
// embed format
const id = link.split('/').pop().split('?')[0];
if(link.includes('/playlist/')) spotifyEmbed.src = `https://open.spotify.com/embed/playlist/${id}`;
else if(link.includes('/track/')) spotifyEmbed.src = `https://open.spotify.com/embed/track/${id}`;
else if(link.includes('/album/')) spotifyEmbed.src = `https://open.spotify.com/embed/album/${id}`;
else spotifyEmbed.src = link; // fallback
spotifyEmbed.style.display = 'block'; customAudio.style.display = 'none';
} else if(link.startsWith('https://') && (link.endsWith('.mp3') || link.endsWith('.ogg') || link.endsWith('.wav'))){
// custom audio raw file
customAudio.src = link; spotifyEmbed.style.display = 'none'; customAudio.style.display = 'block';
} else {
// fallback: place into embed if looks like embed url
spotifyEmbed.src = link; spotifyEmbed.style.display = 'block'; customAudio.style.display = 'none';
}
}
applySpotifyLink(defaultEmbed);


playPause.addEventListener('click', ()=>{
if(customAudio.style.display === 'block'){
if(customAudio.paused){ customAudio.play(); playPause.innerHTML = '<i class="fa-solid fa-pause"></i> Pause' }
else { customAudio.pause(); playPause.innerHTML = '<i class="fa-solid fa-play"></i> Play' }
} else {
// control is limited for Spotify embed — we'll toggle visibility as a pseudo-play
if(spotifyEmbed.style.opacity==='0' || !spotifyEmbed.style.opacity){ spotifyEmbed.style.opacity=1; playPause.innerHTML = '<i class="fa-solid fa-pause"></i> Pause' }
else { spotifyEmbed.style.opacity=0.6; playPause.innerHTML = '<i class="fa-solid fa-play"></i> Play' }
}
});


spotifyLinkInput.addEventListener('change', ()=> applySpotifyLink(spotifyLinkInput.value.trim()) );
customAudioInput.addEventListener('change', ()=> applySpotifyLink(customAudioInput.value.trim()) );


musicToggleBtn.addEventListener('click', ()=>{ musicPanel.classList.toggle('open'); musicPanel.querySelector('input')?.focus(); });


// Keyboard shortcuts
addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='m'){ // toggle audio
if(customAudio.style.display==='block'){ customAudio.paused? customAudio.play(): customAudio.pause(); }
}
});


// Logo click easter egg
const logo = document.getElementById('logo');
let logoClicks = 0;
logo.addEventListener('click', ()=>{ logoClicks++; if(logoClicks>=5){ document.getElementById('secret-modal').hidden = false; document.getElementById('secret-modal').querySelector('#close-secret').focus(); logoClicks = 0; } setTimeout(()=>{ logoClicks=0 },3000); });


// close secret
document.getElementById('close-secret').addEventListener('click', ()=>{ document.getElementById('secret-modal').hidden=true });


// Konami code detection
const konami = [38,38,40,40,37,39,37,39,66,65];
let konamiProgress = 0; window.addEventListener('keydown', (e)=>{
if(e.keyCode === konami[konamiProgress]) konamiProgress++; else konamiProgress=0;
if(konamiProgress === konami.length){ document.querySelector('.card').classList.add('ambient-ultra'); // burst
for(let i=0;i<30;i++) shootStar(); konamiProgress=0; setTimeout(()=> document.querySelector('.card').classList.remove('ambient-ultra'), 8000);
}
});


// small accessibility: open spotify input when spotify open button clicked
const spotifyOpenBtn = document.getElementById('spotify-open'); spotifyOpenBtn.addEventListener('click', (e)=>{ e.preventDefault(); musicPanel.classList.add('open'); spotifyLinkInput.focus() });


// defensive: stop animations on visibility change
addEventListener('visibilitychange', ()=>{ if(document.hidden) cancelAnimationFrame(animId); else loop(); });


// small mobile-friendly touch transform for buttons
const linkBtns = document.querySelectorAll('.link-btn');
linkBtns.forEach(b=>{ b.addEventListener('touchstart', ()=> b.style.transform='translateY(-6px)'); b.addEventListener('touchend', ()=> b.style.transform='translateY(0)'); });


// final small: ensure iframe has initial src
if(!spotifyEmbed.src) spotifyEmbed.src = defaultEmbed;


// End of script.js
