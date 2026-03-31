// ── Weather system (updateWeather, getSkyColors, getDayNightAlpha) ──

function updateWeather() {
  const seed = Math.floor(Date.now() / (3 * 60 * 60 * 1000)); // 3-hour blocks
  const hash = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  const rand = hash - Math.floor(hash);
  const isWinter = CURRENT_MONTH >= 10 || CURRENT_MONTH <= 1;
  const isSummer = CURRENT_MONTH >= 2 && CURRENT_MONTH <= 8;
  if (rand < 0.55) currentWeather = 'clear';
  else if (rand < 0.75) currentWeather = 'rain';
  else if (rand < 0.88) currentWeather = isWinter ? 'snow' : 'rain';
  else currentWeather = isSummer ? 'thunderstorm' : (isWinter ? 'snow' : 'rain');
  // Lightning flash
  if (currentWeather === 'thunderstorm' && lightningFlash <= 0 && Math.random() < 0.003) {
    lightningFlash = 8;
  }
  if (lightningFlash > 0) lightningFlash--;
}

function getSkyColors() {
  const hour = new Date().getHours();
  const min = new Date().getMinutes();
  const t = hour + min / 60;
  if (t >= 7 && t < 16) return { top: '#87CEEB', mid: '#B0E0FF', bot: '#E8F4FD' };
  if (t >= 16 && t < 18) return { top: '#FF8C42', mid: '#FFB088', bot: '#FFD4B2' };
  if (t >= 18 && t < 20) return { top: '#4A1942', mid: '#6B3FA0', bot: '#9B59B6' };
  if (t >= 6 && t < 7) return { top: '#FFB6C1', mid: '#FFDAB9', bot: '#FFE4C4' };
  return { top: '#0A0A2E', mid: '#151540', bot: '#1F1F55', stars: true };
}

function getDayNightAlpha() {
  const hour = new Date().getHours();
  const min = new Date().getMinutes();
  const t = hour + min / 60;
  if (t >= 22 || t < 6) return 0.3;                          // Full night
  if (t >= 6 && t < 7) return 0.3 - (t - 6) * 0.3;          // Dawn → day
  if (t >= 7 && t < 17) return 0;                             // Full day
  if (t >= 17 && t < 19) return (t - 17) / 2 * 0.1;          // Sunset: 0 → 0.1
  if (t >= 19 && t < 22) return 0.1 + (t - 19) / 3 * 0.2;   // Evening → night: 0.1 → 0.3
  return 0;
}
