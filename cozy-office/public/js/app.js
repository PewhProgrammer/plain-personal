// ── Cozy Office - Entry Point (game loop, resize, time) ──────────

// ── Resize handler ───────────────────────────────────────────────
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (canvas.width < 600) {
    renderScale = Math.min(canvas.width / 720, 0.75);
    camX = canvas.width / 2 - 28 * renderScale;
    camY = canvas.height * 0.18;
  } else {
    renderScale = 1.35;
    camX = canvas.width / 2;
    camY = canvas.height * 0.32;
  }
  lightDirty = true;
}
window.addEventListener('resize', resize);
resize();

// ── Time display ─────────────────────────────────────────────────
function updateTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('time-display').textContent = `${h}:${m}`;
  const weatherLabels = { clear: '\u2600\uFE0F Clear', rain: '\uD83C\uDF27\uFE0F Rain', snow: '\u2744\uFE0F Snow', thunderstorm: '\u26C8\uFE0F Storm' };
  document.getElementById('weather-display').textContent = weatherLabels[currentWeather] || '';
}
setInterval(updateTime, 1000);
updateTime();

// ── Initial state based on current time ──────────────────────────
(function initSchedule() {
  const schedule = getCurrentSchedule();
  if (schedule === 'boardgame') {
    for (const [name, h] of Object.entries(humans)) {
      h.x = GAME_POS[name].x;
      h.y = GAME_POS[name].y;
      h.state = 'playingBoardGame';
      h.stateTimer = 200 + Math.random() * 300;
    }
  } else if (schedule === 'sleep') {
    for (const [name, h] of Object.entries(humans)) {
      h.x = BED_POS[name].x;
      h.y = BED_POS[name].y;
      h.state = 'sleeping';
      h.stateTimer = 9999;
    }
    for (const [pName, pet] of Object.entries(pets)) {
      pet.x = PET_BED_POS[pName].x;
      pet.y = PET_BED_POS[pName].y;
      pet.state = 'cuddleLaying';
      pet.stateTimer = 9999;
    }
  }
})();

// ── Main loop ────────────────────────────────────────────────────
function gameLoop() {
  frame++;
  checkScheduleChange();
  updateWeather();
  updateFeeding();
  updateDelivery();
  updatePets();
  updateHumans();
  updateThoughts();
  updateNotifications();
  updateVideoCall();
  updateShootingStar();
  updateBirds();
  drawScene();
  drawNightOverlay();
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('Cozy Office is running! Pets are living their best lives...');
