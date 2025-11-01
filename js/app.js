const bubble = document.getElementById('control-bubble');
const panel = document.getElementById('control-panel');

bubble.addEventListener('click', () => {
  panel.classList.toggle('hidden');
});
