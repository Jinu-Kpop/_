// Music Player
const bgMusic = document.getElementById('bg-music');
bgMusic.src = "https://drive.google.com/uc?export=download&id=1NaMhVAtrKCwAkvRWqgUksfBSYDmZv-qM";

const playPause = document.getElementById('playPause');
const volume = document.getElementById('volume');
const modeToggle = document.getElementById('modeToggle');
const accountBtn = document.getElementById('accountBtn');
const modal = document.getElementById('accountModal');
const closeAccount = document.getElementById('closeAccount');

let isPlaying = true;

playPause.onclick = () => {
  if (isPlaying) {
    bgMusic.pause();
  } else {
    bgMusic.play();
  }
  isPlaying = !isPlaying;
};

volume.oninput = (e) => {
  bgMusic.volume = e.target.value;
};

modeToggle.onclick = () => {
  document.body.classList.toggle('light');
};

// Account System
accountBtn.onclick = () => {
  modal.classList.remove('hidden');
};

closeAccount.onclick = () => {
  modal.classList.add('hidden');
};

// Easter Eggs + Achievements
const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
const list = document.getElementById('achievementsList');

function addAchievement(name, msg) {
  if (!achievements.includes(name)) {
    achievements.push(name);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    alert(`🏆 Achievement Unlocked: ${msg}`);
  }
}

document.body.addEventListener('click', (e) => {
  if (Math.random() > 0.98) addAchievement('RandomClick', 'Curious Explorer!');
});

list.innerHTML = achievements.map(a => `<li>${a}</li>`).join('');
