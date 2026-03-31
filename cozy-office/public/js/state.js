// ── Cozy Office - Mutable State & Init ──────────────────────────

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let camX = 0;
let camY = 0;
let frame = 0;

// Cached lighting layer
let lightCanvas = null;
let lightCtx = null;
let lightDirty = true;

// Random events
let shootingStar = null;
let windowBirds = [];
let birdTimer = 180 + Math.random() * 180;

// Weather
let currentWeather = 'clear';
let lightningFlash = 0;

// Notifications
const notifications = { boy: [], girl: [] };

// Video call
const videoCallActive = { boy: false, girl: false };
const videoCallTimer = { boy: 0, girl: 0 };

// Photo wall (localStorage persisted)
let photoWall = [];
function initPhotoWall() {
  const stored = localStorage.getItem('cozy-office-photo-wall');
  const lastAdd = localStorage.getItem('cozy-office-photo-last-add');
  photoWall = stored ? JSON.parse(stored) : [];
  const now = Date.now();
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  if (photoWall.length < 12 && (!lastAdd || now - parseInt(lastAdd) > twoDays)) {
    const col = STICKY_COLORS[photoWall.length % STICKY_COLORS.length];
    photoWall.push(col);
    localStorage.setItem('cozy-office-photo-wall', JSON.stringify(photoWall));
    localStorage.setItem('cozy-office-photo-last-add', now.toString());
  }
}
initPhotoWall();

// Plant growth (localStorage persisted)
let plantGrowthLevel = 4;
function initPlantGrowth() {
  let start = localStorage.getItem('cozy-office-plant-start');
  if (!start) {
    start = Date.now().toString();
    localStorage.setItem('cozy-office-plant-start', start);
  }
  const days = (Date.now() - parseInt(start)) / (24 * 60 * 60 * 1000);
  plantGrowthLevel = Math.min(4, Math.floor(days / 3));
}
initPlantGrowth();

// Feeding
let feedingActive = false;
let lastFeedingHour = -1;

// Delivery
let deliveryTimer = (30 + Math.random() * 30) * 60 * 60;
let deliveryPerson = null;
let deliveryReceiver = null;

// Schedule
function getCurrentSchedule() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return 'work';
  if (hour >= 17 && hour < 22) return 'boardgame';
  return 'sleep';
}
let currentSchedule = getCurrentSchedule();

// Cuddle / workout triggers (from WebSocket)
let cuddleTriggered = false;
window.addEventListener('cuddle', () => { cuddleTriggered = true; });

let workoutStarted = false;
let workoutStopped = false;
window.addEventListener('workout', (e) => {
  console.log('[app] workout event:', e.detail);
  if (e.detail && e.detail.active) {
    workoutStarted = true;
  } else {
    workoutStopped = true;
  }
});

// Humans
const humans = {
  boy: {
    x: DESK_POS.boy.x, y: DESK_POS.boy.y,
    state: 'working',
    stateTimer: 300 + Math.random() * 400,
    targetX: 0, targetY: 0,
    speed: 0.03, dir: 1,
    targetPet: null,
    speechText: '', speechAlpha: 0, speechTimer: 0,
    chatLine: 0,
  },
  girl: {
    x: DESK_POS.girl.x, y: DESK_POS.girl.y,
    state: 'working',
    stateTimer: 250 + Math.random() * 400,
    targetX: 0, targetY: 0,
    speed: 0.027, dir: 1,
    targetPet: null,
    speechText: '', speechAlpha: 0, speechTimer: 0,
    chatLine: 0,
  },
};

// Pets
const pets = {
  dog: {
    x: 6, y: 5.5, z: 0.2,
    targetX: 6, targetY: 5.5,
    speed: 0.022, dir: 1,
    state: 'walking', stateTimer: 100,
    playPartner: null, walkFrame: 0,
  },
  cat: {
    x: 8, y: 7, z: 0.2,
    targetX: 8, targetY: 7,
    speed: 0.015, dir: 1,
    state: 'walking', stateTimer: 150,
    playPartner: null, walkFrame: 0,
  },
  frog: {
    x: 4, y: 7.5, z: 0.15,
    targetX: 4, targetY: 7.5,
    speed: 0.018, dir: 1,
    state: 'walking', stateTimer: 120,
    playPartner: null, walkFrame: 0,
  },
};

// Thoughts
const thoughts = {
  boy: { text: '', alpha: 0, timer: 300 + Math.random() * 400 },
  girl: { text: '', alpha: 0, timer: 200 + Math.random() * 500 },
};

// Render scale
let renderScale = 1;
