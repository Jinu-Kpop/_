const popup = document.getElementById('achievement-popup');
function showAchievement(msg) {
  popup.innerText = msg;
  popup.style.display = 'block';
  setTimeout(() => popup.style.display = 'none', 3000);
}

// Example Easter Egg
document.body.addEventListener('keydown', (e) => {
  if (e.key === 'k') showAchievement("You found the secret 'K' Easter Egg!");
});
