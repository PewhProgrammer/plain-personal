// ── Pet AI (distBetween, pickRandomTarget, findNearbyPet, transitionState, updatePets) ──

function distBetween(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function pickRandomTarget(name) {
  const b = PET_BOUNDS[name];
  let x, y, attempts = 0;
  do {
    x = b.minX + Math.random() * (b.maxX - b.minX);
    y = b.minY + Math.random() * (b.maxY - b.minY);
    attempts++;
  } while (isInsideCollider(x, y) && attempts < 10);
  return { x, y };
}

function findNearbyPet(name, maxDist) {
  const pet = pets[name];
  for (const [otherName, other] of Object.entries(pets)) {
    if (otherName === name) continue;
    if (other.state === 'sleeping') continue;
    if (distBetween(pet, other) < maxDist) return otherName;
  }
  return null;
}

function transitionState(name, pet) {
  const currentState = pet.state;
  const roll = Math.random();

  if (currentState === 'walking' || currentState === 'idle') {
    // Pet-to-pet interactions (~8% chance when in range)
    for (const interaction of PET_INTERACTIONS) {
      if (name === interaction.predator) {
        const prey = pets[interaction.prey];
        if (prey && prey.state !== 'sleeping' && prey.state !== 'eating' &&
            prey.state !== 'fleeing' && prey.state !== 'cuddleLaying') {
          const d = distBetween(pet, prey);
          if (d < interaction.range && roll < 0.08) {
            pet.state = 'stalking';
            pet._stalkTarget = interaction.prey;
            pet.stateTimer = 180;
            return;
          }
        }
      }
    }

    const nearby = findNearbyPet(name, 1.5);
    if (nearby && roll < 0.25 && pets[nearby].state !== 'playing') {
      pet.state = 'playing';
      pet.playPartner = nearby;
      pets[nearby].state = 'playing';
      pets[nearby].playPartner = name;
      pet.stateTimer = 100 + Math.random() * 120;
      pets[nearby].stateTimer = pet.stateTimer;
      return;
    }

    // Rare animations (~3% chance each)
    if (name === 'dog' && roll >= 0.25 && roll < 0.28) {
      pet.state = 'zoomies';
      pet.stateTimer = 120;
      pet._zoomCenter = { x: pet.x, y: pet.y };
      return;
    }
    if (name === 'cat' && roll >= 0.25 && roll < 0.28) {
      pet.state = 'knocking';
      pet.stateTimer = 90;
      return;
    }
    if (name === 'frog' && roll >= 0.25 && roll < 0.28) {
      pet.state = 'tongueCatch';
      pet.stateTimer = 60;
      return;
    }

    if (roll < 0.35) {
      pet.state = 'walking';
      const target = pickRandomTarget(name);
      pet.targetX = target.x;
      pet.targetY = target.y;
      pet.stateTimer = 80 + Math.random() * 150;
    } else if (roll < 0.6) {
      pet.state = 'laying';
      pet.stateTimer = 120 + Math.random() * 150;
    } else if (roll < 0.72) {
      // Walk to sleep spot instead of instant sleep
      pet.state = 'walkingToSleep';
      const spot = PET_SLEEP_SPOTS[name];
      pet.targetX = spot.x;
      pet.targetY = spot.y;
      pet.stateTimer = 9999;
      return;
    } else {
      pet.state = 'idle';
      pet.stateTimer = 50 + Math.random() * 80;
    }
  } else if (currentState === 'laying') {
    if (roll < 0.4) {
      pet.state = 'walkingToSleep';
      const spot = PET_SLEEP_SPOTS[name];
      pet.targetX = spot.x;
      pet.targetY = spot.y;
      pet.stateTimer = 9999;
    } else {
      pet.state = 'walking';
      const target = pickRandomTarget(name);
      pet.targetX = target.x;
      pet.targetY = target.y;
      pet.stateTimer = 80 + Math.random() * 120;
    }
  } else if (currentState === 'sleeping') {
    pet.state = 'laying';
    // Reset z to ground level when waking up from elevated sleep spots
    if (name === 'cat') pet.z = 0.2;
    else if (name === 'frog') pet.z = 0.15;
    else pet.z = 0.2;
    pet.stateTimer = 50 + Math.random() * 80;
  } else if (currentState === 'playing') {
    pet.playPartner = null;
    pet.state = 'walking';
    const target = pickRandomTarget(name);
    pet.targetX = target.x;
    pet.targetY = target.y;
    pet.stateTimer = 80 + Math.random() * 100;
  } else if (currentState === 'zoomies' || currentState === 'knocking' || currentState === 'tongueCatch') {
    pet.state = 'idle';
    pet.stateTimer = 50 + Math.random() * 80;
  } else if (currentState === 'stalking' || currentState === 'chasing' || currentState === 'fleeing') {
    pet.state = 'idle';
    pet.stateTimer = 50 + Math.random() * 80;
  } else if (currentState === 'eating') {
    pet.state = 'idle';
    pet.stateTimer = 50 + Math.random() * 80;
  }
}

function updatePets() {
  for (const [name, pet] of Object.entries(pets)) {
    pet.stateTimer--;
    pet.walkFrame++;

    if (pet.stateTimer <= 0 && pet.state !== 'jumpingOnBed' && pet.state !== 'followingForWalk' && pet.state !== 'outsideWalk' && pet.state !== 'followingBackFromWalk') {
      transitionState(name, pet);
    }

    if (pet.state === 'walking') {
      const dx = pet.targetX - pet.x;
      const dy = pet.targetY - pet.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0.08) {
        const vx = (dx / dist) * pet.speed;
        const vy = (dy / dist) * pet.speed;
        const res = resolveMovement(pet.x, pet.y, pet.x + vx, pet.y + vy, 0.15, pet.targetX, pet.targetY);
        pet.x = res.x;
        pet.y = res.y;

        if (Math.abs(vx) > Math.abs(vy)) {
          pet.dir = vx > 0 ? 1 : -1;
        } else {
          pet.dir = vx >= 0 ? 1 : -1;
        }
      } else {
        pet.state = 'idle';
        pet.stateTimer = 50 + Math.random() * 100;
      }
    } else if (pet.state === 'playing') {
      const partner = pet.playPartner && pets[pet.playPartner];
      if (partner && partner.state === 'playing') {
        const angle = frame * 0.03 + (name === 'dog' ? 0 : name === 'cat' ? 2 : 4);
        const orbRadius = 0.8;
        const cx = (pet.x + partner.x) / 2;
        const cy = (pet.y + partner.y) / 2;
        const tx = cx + Math.cos(angle) * orbRadius;
        const ty = cy + Math.sin(angle) * orbRadius;

        const b = PET_BOUNDS[name];
        pet.targetX = Math.max(b.minX, Math.min(b.maxX, tx));
        pet.targetY = Math.max(b.minY, Math.min(b.maxY, ty));

        const dx = pet.targetX - pet.x;
        const dy = pet.targetY - pet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.05) {
          const res = resolveMovement(pet.x, pet.y, pet.x + (dx / dist) * pet.speed * 1.5, pet.y + (dy / dist) * pet.speed * 1.5, 0.15, pet.targetX, pet.targetY);
          pet.x = res.x;
          pet.y = res.y;
          pet.dir = dx > 0 ? 1 : -1;
        }
      } else {
        pet.state = 'idle';
        pet.playPartner = null;
        pet.stateTimer = 50;
      }
    } else if (pet.state === 'zoomies') {
      // Dog runs in a fast circle
      const angle = (120 - pet.stateTimer) * 0.12;
      const radius = 1.0;
      const cx = pet._zoomCenter ? pet._zoomCenter.x : pet.x;
      const cy = pet._zoomCenter ? pet._zoomCenter.y : pet.y;
      const tx = cx + Math.cos(angle) * radius;
      const ty = cy + Math.sin(angle) * radius;
      const b = PET_BOUNDS[name];
      pet.targetX = Math.max(b.minX, Math.min(b.maxX, tx));
      pet.targetY = Math.max(b.minY, Math.min(b.maxY, ty));
      const dx = pet.targetX - pet.x;
      const dy = pet.targetY - pet.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.05) {
        const res = resolveMovement(pet.x, pet.y, pet.x + (dx / dist) * pet.speed * 3, pet.y + (dy / dist) * pet.speed * 3, 0.15, pet.targetX, pet.targetY);
        pet.x = res.x;
        pet.y = res.y;
        pet.dir = dx > 0 ? 1 : -1;
      }
    } else if (pet.state === 'knocking' || pet.state === 'tongueCatch') {
      // Stay in place, visual only
    } else if (pet.state === 'cuddleWalking') {
      const dx = pet.targetX - pet.x;
      const dy = pet.targetY - pet.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.08) {
        const vx = (dx / dist) * pet.speed * 2;
        const vy = (dy / dist) * pet.speed * 2;
        const res = resolveMovement(pet.x, pet.y, pet.x + vx, pet.y + vy, 0.15, pet.targetX, pet.targetY);
        pet.x = res.x;
        pet.y = res.y;
        pet.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 1 : -1) : (vx >= 0 ? 1 : -1);
      } else {
        pet.state = 'jumpingOnBed';
        pet.stateTimer = 45;
        pet._jumpProgress = 0;
      }
    } else if (pet.state === 'jumpingOnBed') {
      pet._jumpProgress = Math.min(1, (pet._jumpProgress || 0) + 1 / 45);
      const t = pet._jumpProgress;
      pet.z = BED_SURFACE_Z * t + Math.sin(t * Math.PI) * 0.5;
      if (pet.stateTimer <= 0) {
        pet.z = BED_SURFACE_Z;
        pet.state = 'cuddleLaying';
        pet.stateTimer = 9999;
      }
    } else if (pet.state === 'walkingToSleep') {
      const spot = PET_SLEEP_SPOTS[name];
      const dx = spot.x - pet.x;
      const dy = spot.y - pet.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.08) {
        const vx = (dx / dist) * pet.speed;
        const vy = (dy / dist) * pet.speed;
        const res = resolveMovement(pet.x, pet.y, pet.x + vx, pet.y + vy, 0.15, spot.x, spot.y);
        pet.x = res.x;
        pet.y = res.y;
        pet.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 1 : -1) : (vx >= 0 ? 1 : -1);
      } else {
        pet.x = spot.x;
        pet.y = spot.y;
        pet.z = spot.z;
        pet.state = 'sleeping';
        pet.stateTimer = 200 + Math.random() * 250;
      }
    } else if (pet.state === 'stalking') {
      const prey = pet._stalkTarget && pets[pet._stalkTarget];
      if (prey && prey.state !== 'sleeping') {
        const dx = prey.x - pet.x;
        const dy = prey.y - pet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.05) {
          const res = resolveMovement(pet.x, pet.y, pet.x + (dx / dist) * pet.speed * 0.5, pet.y + (dy / dist) * pet.speed * 0.5, 0.15, prey.x, prey.y);
          pet.x = res.x;
          pet.y = res.y;
          pet.dir = dx > 0 ? 1 : -1;
        }
        if (dist < 0.5) {
          // Pounce! Predator chases, prey flees
          pet.state = 'chasing';
          pet.stateTimer = 120;
          prey.state = 'fleeing';
          prey._fleeFrom = name;
          prey.stateTimer = 120;
        }
      }
    } else if (pet.state === 'chasing') {
      const prey = pet._stalkTarget && pets[pet._stalkTarget];
      if (prey) {
        const dx = prey.x - pet.x;
        const dy = prey.y - pet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.05) {
          const res = resolveMovement(pet.x, pet.y, pet.x + (dx / dist) * pet.speed * 2.5, pet.y + (dy / dist) * pet.speed * 2.5, 0.15, prey.x, prey.y);
          pet.x = res.x;
          pet.y = res.y;
          pet.dir = dx > 0 ? 1 : -1;
        }
      }
    } else if (pet.state === 'fleeing') {
      const predator = pet._fleeFrom && pets[pet._fleeFrom];
      if (predator) {
        const dx = pet.x - predator.x;
        const dy = pet.y - predator.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.05) {
          let nx = pet.x + (dx / dist) * pet.speed * 3;
          let ny = pet.y + (dy / dist) * pet.speed * 3;
          const b = PET_BOUNDS[name];
          nx = Math.max(b.minX, Math.min(b.maxX, nx));
          ny = Math.max(b.minY, Math.min(b.maxY, ny));
          pet.dir = nx > pet.x ? 1 : -1;
          const res = resolveMovement(pet.x, pet.y, nx, ny, 0.15, nx, ny);
          pet.x = res.x;
          pet.y = res.y;
        }
      }
    } else if (pet.state === 'eating') {
      // Stay at bowl
    } else if (pet.state === 'followingForWalk') {
      const human = humans[pet._followTarget];
      if (human) {
        const tx = human.x - 0.5;
        const ty = human.y + 0.5;
        const dx = tx - pet.x;
        const dy = ty - pet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.15) {
          const res = resolveMovement(pet.x, pet.y, pet.x + (dx / dist) * pet.speed * 2, pet.y + (dy / dist) * pet.speed * 2, 0.15, tx, ty);
          pet.x = res.x;
          pet.y = res.y;
          pet.dir = dx > 0 ? 1 : -1;
        }
        if (human.state === 'outsideWalk') {
          pet.state = 'outsideWalk';
          pet.stateTimer = 9999;
        }
      } else {
        pet.state = 'walking';
        const target = pickRandomTarget(name);
        pet.targetX = target.x;
        pet.targetY = target.y;
        pet.stateTimer = 80 + Math.random() * 100;
      }
    } else if (pet.state === 'outsideWalk') {
      // Hidden, waiting for human to return
    } else if (pet.state === 'followingBackFromWalk') {
      const human = humans[pet._followTarget];
      if (human) {
        const tx = human.x - 0.3;
        const ty = human.y + 0.3;
        const dx = tx - pet.x;
        const dy = ty - pet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.15) {
          const res = resolveMovement(pet.x, pet.y, pet.x + (dx / dist) * pet.speed * 2, pet.y + (dy / dist) * pet.speed * 2, 0.15, tx, ty);
          pet.x = res.x;
          pet.y = res.y;
          pet.dir = dx > 0 ? 1 : -1;
        }
        if (human.state === 'working' || human.state === 'walkingToGame' || human.state === 'walkingToBedForSleep' || human.state === 'playingBoardGame') {
          pet._followTarget = null;
          pet.state = 'walking';
          const target = pickRandomTarget(name);
          pet.targetX = target.x;
          pet.targetY = target.y;
          pet.stateTimer = 80 + Math.random() * 100;
        }
      } else {
        pet._followTarget = null;
        pet.state = 'walking';
        const target = pickRandomTarget(name);
        pet.targetX = target.x;
        pet.targetY = target.y;
        pet.stateTimer = 80 + Math.random() * 100;
      }
    }
    // cuddleLaying: pets just stay put near the bed
  }
}
