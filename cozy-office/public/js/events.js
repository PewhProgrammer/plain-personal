// ── Events (feeding, delivery, notifications, video call, shooting star, birds) ──

function updateFeeding() {
  const hour = new Date().getHours();
  const min = new Date().getMinutes();
  if (FEEDING_HOURS.includes(hour) && min < 5) {
    if (lastFeedingHour !== hour) {
      lastFeedingHour = hour;
      feedingActive = true;
      // Direct non-sleeping pets to their bowls
      for (const [pName, pet] of Object.entries(pets)) {
        if (pet.state !== 'sleeping' && pet.state !== 'cuddleLaying' && pet.state !== 'eating') {
          pet.state = 'walking';
          pet.targetX = FOOD_BOWL_POS[pName].x;
          pet.targetY = FOOD_BOWL_POS[pName].y;
          pet.stateTimer = 9999;
          pet._feedingWalk = true;
        }
      }
    }
    // Check if pets arrived at bowls
    for (const [pName, pet] of Object.entries(pets)) {
      if (pet._feedingWalk && pet.state === 'walking') {
        const dx = FOOD_BOWL_POS[pName].x - pet.x;
        const dy = FOOD_BOWL_POS[pName].y - pet.y;
        if (Math.sqrt(dx * dx + dy * dy) < 0.15) {
          pet.state = 'eating';
          pet.stateTimer = 180;
          pet._feedingWalk = false;
        }
      }
    }
  } else {
    if (feedingActive) {
      feedingActive = false;
      lastFeedingHour = -1;
    }
  }
}

function updateDelivery() {
  if (currentSchedule === 'sleep') return;

  if (!deliveryPerson) {
    deliveryTimer--;
    if (deliveryTimer <= 0) {
      deliveryPerson = { x: -1.5, y: DOOR_POS.y, phase: 'arriving', timer: 0 };
      deliveryTimer = (30 + Math.random() * 30) * 60 * 60;
    }
    return;
  }

  deliveryPerson.timer++;
  if (deliveryPerson.phase === 'arriving') {
    const dx = DOOR_POS.x - deliveryPerson.x;
    if (Math.abs(dx) > 0.08) {
      deliveryPerson.x += (dx > 0 ? 1 : -1) * 0.03;
    } else {
      deliveryPerson.x = DOOR_POS.x;
      deliveryPerson.phase = 'waiting';
      deliveryPerson.timer = 0;
      // Pick a human to receive
      const candidates = [];
      for (const [n, h] of Object.entries(humans)) {
        if (h.state === 'working' || h.state === 'playingBoardGame') candidates.push(n);
      }
      if (candidates.length > 0) {
        deliveryReceiver = candidates[Math.floor(Math.random() * candidates.length)];
        const h = humans[deliveryReceiver];
        h.state = 'walkingToDoor';
        h.targetX = DOOR_POS.x;
        h.targetY = DOOR_POS.y;
        h.stateTimer = 9999;
        h.speechText = '';
        h.speechAlpha = 0;
      }
    }
  } else if (deliveryPerson.phase === 'waiting') {
    if (deliveryPerson.timer > 180) {
      deliveryPerson.phase = 'leaving';
      deliveryPerson.timer = 0;
    }
  } else if (deliveryPerson.phase === 'leaving') {
    deliveryPerson.x -= 0.04;
    if (deliveryPerson.x < -2) {
      deliveryPerson = null;
    }
  }
}

function updateNotifications() {
  if (currentSchedule !== 'work') {
    notifications.boy = [];
    notifications.girl = [];
    return;
  }
  for (const who of ['boy', 'girl']) {
    // Spawn new notifications
    if (Math.random() < 0.005 && notifications[who].length < 3) {
      notifications[who].push({
        color: NOTIF_COLORS[Math.floor(Math.random() * NOTIF_COLORS.length)],
        timer: 120 + Math.random() * 180, // 2-5 seconds
      });
    }
    // Decay
    for (let i = notifications[who].length - 1; i >= 0; i--) {
      notifications[who][i].timer--;
      if (notifications[who][i].timer <= 0) {
        notifications[who].splice(i, 1);
      }
    }
  }
}

function updateVideoCall() {
  for (const who of ['boy', 'girl']) {
    if (videoCallActive[who]) {
      videoCallTimer[who]--;
      if (videoCallTimer[who] <= 0) {
        videoCallActive[who] = false;
      }
    } else if (currentSchedule === 'work' && humans[who].state === 'working' && Math.random() < 0.003) {
      videoCallActive[who] = true;
      videoCallTimer[who] = 300 + Math.random() * 180; // 5-8 seconds
      humans[who].speechText = who === 'boy' ? 'Hey! \uD83D\uDC4B' : 'Hi there! \uD83D\uDE4B';
      humans[who].speechAlpha = 1;
      humans[who].speechTimer = 120;
    }
  }
}

function updateShootingStar() {
  const sky = getSkyColors();
  if (!sky.stars) { shootingStar = null; return; }

  if (!shootingStar) {
    if (Math.random() < 0.0005) {
      shootingStar = {
        x: 1.8 + Math.random() * 0.4,
        z: 1.4 + Math.random() * 0.3,
        dx: -0.08 - Math.random() * 0.04,
        dz: -0.04 - Math.random() * 0.02,
        life: 0,
        maxLife: 15 + Math.floor(Math.random() * 10),
      };
    }
    return;
  }

  shootingStar.x += shootingStar.dx;
  shootingStar.z += shootingStar.dz;
  shootingStar.life++;
  if (shootingStar.life >= shootingStar.maxLife) shootingStar = null;
}

function updateBirds() {
  const sky = getSkyColors();
  if (sky.stars) { windowBirds = []; return; }

  birdTimer--;
  if (birdTimer <= 0 && windowBirds.length === 0) {
    const count = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      windowBirds.push({
        x: 0.5 + Math.random() * 1.5,
        z: 0.2,
        approachY: -0.5 - Math.random() * 0.3,
        timer: 0,
        state: 'arriving',
        sitDuration: 180 + Math.random() * 180,
        wingPhase: Math.random() * Math.PI * 2,
      });
    }
    birdTimer = 2700 + Math.random() * 900;
  }

  for (let i = windowBirds.length - 1; i >= 0; i--) {
    const bird = windowBirds[i];
    bird.timer++;
    if (bird.state === 'arriving') {
      bird.approachY += 0.02;
      if (bird.approachY >= 0) {
        bird.approachY = 0;
        bird.state = 'sitting';
        bird.timer = 0;
      }
    } else if (bird.state === 'sitting') {
      if (bird.timer >= bird.sitDuration) {
        bird.state = 'leaving';
        bird.timer = 0;
      }
    } else if (bird.state === 'leaving') {
      bird.approachY -= 0.025;
      bird.z += 0.01;
      if (bird.timer > 40) windowBirds.splice(i, 1);
    }
  }
}
