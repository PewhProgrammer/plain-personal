// ── Human AI (humanTransition, checkScheduleChange, moveToward, updateHumans, updateThoughts) ──

function humanTransition(name) {
  const h = humans[name];
  const other = name === 'boy' ? humans.girl : humans.boy;
  const roll = Math.random();

  if (h.state === 'working') {
    if (name === 'boy' && other.state === 'working') {
      if (roll < 0.35) {
        const chat = COUPLE_CHATS[Math.floor(Math.random() * COUPLE_CHATS.length)];
        h.state = 'walkingToPartner';
        h.targetX = CHAT_POS.boy.x;
        h.targetY = CHAT_POS.boy.y;
        h.chatLine = 0;
        h._chatPair = chat;
        h.stateTimer = 9999;

        other.state = 'walkingToPartner';
        other.targetX = CHAT_POS.girl.x;
        other.targetY = CHAT_POS.girl.y;
        other.chatLine = 0;
        other._chatPair = chat;
        other.stateTimer = 9999;
        return;
      } else if (roll < 0.55) {
        const petNames = Object.keys(pets);
        const petName = petNames[Math.floor(Math.random() * petNames.length)];
        h.state = 'walkingToPet';
        h.targetPet = petName;
        h.stateTimer = 9999;
        return;
      }
    }
    if (name === 'girl' && other.state === 'working' && roll < 0.2) {
      const petNames = Object.keys(pets);
      const petName = petNames[Math.floor(Math.random() * petNames.length)];
      h.state = 'walkingToPet';
      h.targetPet = petName;
      h.stateTimer = 9999;
      return;
    }
    // Stretching (~5% chance)
    if (roll >= 0.55 && roll < 0.60) {
      h.state = 'stretching';
      h.stateTimer = 120; // ~2 seconds
      h.speechText = name === 'boy' ? '*stretches* \uD83D\uDE4C' : '*yawn* \uD83D\uDE34';
      h.speechAlpha = 1;
      h.speechTimer = 100;
      return;
    }
    // Coffee routine (~10% chance)
    if (roll >= 0.60 && roll < 0.70) {
      h.state = 'walkingToCoffee';
      h.targetX = COFFEE_POS.x;
      h.targetY = COFFEE_POS.y;
      h.stateTimer = 9999;
      return;
    }
    // Leisure walk (~5% chance)
    if (roll >= 0.70 && roll < 0.75) {
      const petNames = Object.keys(pets);
      const walkPet = petNames[Math.floor(Math.random() * petNames.length)];
      const pet = pets[walkPet];
      if (pet.state === 'walking' || pet.state === 'idle' || pet.state === 'laying') {
        h.state = 'walkingToDoorForWalk';
        h.targetX = DOOR_POS.x;
        h.targetY = DOOR_POS.y;
        h.stateTimer = 9999;
        h._walkPet = walkPet;
        const line = WALK_LEAVE_LINES[Math.floor(Math.random() * WALK_LEAVE_LINES.length)];
        h.speechText = line;
        h.speechAlpha = 1;
        h.speechTimer = 120;
        pet.state = 'followingForWalk';
        pet._followTarget = name;
        pet.stateTimer = 9999;
        return;
      }
    }
    h.stateTimer = 200 + Math.random() * 300;
  }
}

function checkScheduleChange() {
  const newSchedule = getCurrentSchedule();
  if (newSchedule === currentSchedule) return;
  currentSchedule = newSchedule;

  // Force-transition all characters
  for (const [name, h] of Object.entries(humans)) {
    h.speechText = ''; h.speechAlpha = 0; h.targetPet = null;

    // If outside on a walk, teleport back to door first
    if (h.state === 'outsideWalk' || h.state === 'walkingToDoorForWalk') {
      h.x = DOOR_POS.x;
      h.y = DOOR_POS.y;
      if (h._walkPet && pets[h._walkPet]) {
        const wp = pets[h._walkPet];
        wp.x = DOOR_POS.x + 0.3;
        wp.y = DOOR_POS.y + 0.3;
        wp.state = 'walking';
        wp._followTarget = null;
        const target = pickRandomTarget(h._walkPet);
        wp.targetX = target.x;
        wp.targetY = target.y;
        wp.stateTimer = 80 + Math.random() * 100;
      }
      h._walkPet = null;
    }

    if (newSchedule === 'work') {
      h.state = 'walkingBack';
      h.targetX = DESK_POS[name].x;
      h.targetY = DESK_POS[name].y;
      h.stateTimer = 9999;
    } else if (newSchedule === 'boardgame') {
      h.state = 'walkingToGame';
      h.targetX = GAME_POS[name].x;
      h.targetY = GAME_POS[name].y;
      h.stateTimer = 9999;
    } else { // sleep
      h.state = 'walkingToBedForSleep';
      h.targetX = BED_POS[name].x;
      h.targetY = BED_POS[name].y;
      h.stateTimer = 9999;
    }
  }

  // Handle pets
  if (newSchedule === 'sleep') {
    for (const [pName, pet] of Object.entries(pets)) {
      pet.state = 'cuddleWalking';
      pet.targetX = PET_BED_POS[pName].x;
      pet.targetY = PET_BED_POS[pName].y;
      pet.stateTimer = 9999;
      pet.playPartner = null;
      pet._stalkTarget = null;
      pet._fleeFrom = null;
      pet._feedingWalk = false;
    }
  } else {
    for (const [pName, pet] of Object.entries(pets)) {
      if (pet.state === 'cuddleLaying' || pet.state === 'cuddleWalking') {
        // Reset z to ground level
        if (pName === 'cat') pet.z = 0.2;
        else if (pName === 'frog') pet.z = 0.15;
        else pet.z = 0.2;
        pet.state = 'walking';
        const target = pickRandomTarget(pName);
        pet.targetX = target.x;
        pet.targetY = target.y;
        pet.stateTimer = 80 + Math.random() * 100;
      }
    }
  }
  lightDirty = true;
}

function moveToward(h, tx, ty) {
  const dx = tx - h.x;
  const dy = ty - h.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 0.1) {
    const vx = (dx / dist) * h.speed;
    const vy = (dy / dist) * h.speed;
    const res = resolveMovement(h.x, h.y, h.x + vx, h.y + vy, 0.25, tx, ty);
    h.x = res.x;
    h.y = res.y;
    if (Math.abs(vx) > Math.abs(vy)) {
      h.dir = vx > 0 ? 1 : -1;
    } else {
      h.dir = vy > 0 ? 1 : -1;
    }
    return false;
  }
  h.x = tx;
  h.y = ty;
  return true;
}

function updateHumans() {
  // Check for cuddle trigger (from button press, synced via WebSocket)
  if (cuddleTriggered) {
    cuddleTriggered = false;
    workoutStarted = false;
    workoutStopped = false;
    for (const [name, h] of Object.entries(humans)) {
      h.speechText = '';
      h.speechAlpha = 0;
      h.targetPet = null;
      h.playPartner = null;
      if (h.state === 'outsideWalk') {
        h.x = DOOR_POS.x;
        h.y = DOOR_POS.y;
      }
      if (h._walkPet && pets[h._walkPet]) {
        const wp = pets[h._walkPet];
        if (wp.state === 'outsideWalk' || wp.state === 'followingForWalk') {
          wp.x = DOOR_POS.x + 0.3;
          wp.y = DOOR_POS.y + 0.3;
          wp._followTarget = null;
        }
      }
      h._walkPet = null;
      h.state = 'walkingToBed';
      h.targetX = BED_POS[name].x;
      h.targetY = BED_POS[name].y;
      h.stateTimer = 9999;
    }
    // Pets also join cuddle break
    for (const [pName, pet] of Object.entries(pets)) {
      pet.state = 'cuddleWalking';
      pet.targetX = PET_BED_POS[pName].x;
      pet.targetY = PET_BED_POS[pName].y;
      pet.stateTimer = 9999;
      pet.playPartner = null;
    }
  }

  // Workout toggle (boy only) — force transition from any state so all clients stay in sync
  if (workoutStarted) {
    workoutStarted = false;
    const b = humans.boy;
    console.log('[app] processing workoutStarted, boy state →', b.state);
    if (b.state === 'outsideWalk') {
      b.x = DOOR_POS.x;
      b.y = DOOR_POS.y;
    }
    if (b._walkPet && pets[b._walkPet]) {
      const wp = pets[b._walkPet];
      if (wp.state === 'outsideWalk' || wp.state === 'followingForWalk') {
        wp.x = DOOR_POS.x + 0.3;
        wp.y = DOOR_POS.y + 0.3;
        wp.state = 'walking';
        wp._followTarget = null;
        const target = pickRandomTarget(b._walkPet);
        wp.targetX = target.x;
        wp.targetY = target.y;
        wp.stateTimer = 80 + Math.random() * 100;
      }
    }
    b._walkPet = null;
    b.state = 'walkingToWorkout';
    b.targetX = WORKOUT_POS.x;
    b.targetY = WORKOUT_POS.y;
    b.stateTimer = 9999;
    b.speechText = '';
    b.speechAlpha = 0;
    b.targetPet = null;
  }
  if (workoutStopped) {
    workoutStopped = false;
    const b = humans.boy;
    b.state = 'walkingBack';
    b.targetX = DESK_POS.boy.x;
    b.targetY = DESK_POS.boy.y;
    b.stateTimer = 9999;
  }

  for (const [name, h] of Object.entries(humans)) {
    // Update speech bubble
    if (h.speechAlpha > 0) {
      h.speechTimer--;
      if (h.speechTimer <= 30) {
        h.speechAlpha = Math.max(0, h.speechTimer / 30);
      }
    }

    h.stateTimer--;

    if (h.state === 'working') {
      h.x = DESK_POS[name].x;
      h.y = DESK_POS[name].y;
      // Decay coffee steam
      if (h._hasCoffee && h._coffeeTimer > 0) {
        h._coffeeTimer--;
        if (h._coffeeTimer <= 0) h._hasCoffee = false;
      }
      if (h.stateTimer <= 0) {
        humanTransition(name);
      }
    } else if (h.state === 'walkingToPartner') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        const other = name === 'boy' ? humans.girl : humans.boy;
        const otherArrived = (other.state === 'chatting') ||
          (Math.abs(other.x - other.targetX) < 0.15 && Math.abs(other.y - other.targetY) < 0.15);
        if (otherArrived || other.state === 'chatting') {
          h.state = 'chatting';
          h.stateTimer = 200;
          h.chatLine = 0;
          if (name === 'boy' && h._chatPair) {
            h.speechText = h._chatPair[0];
            h.speechAlpha = 1;
            h.speechTimer = 120;
          }
        }
      }
    } else if (h.state === 'chatting') {
      const other = name === 'boy' ? humans.girl : humans.boy;

      if (name === 'boy' && h.chatLine === 0 && h.stateTimer < 250) {
        if (other._chatPair && other.speechAlpha <= 0) {
          other.speechText = other._chatPair[1];
          other.speechAlpha = 1;
          other.speechTimer = 120;
          h.chatLine = 1;
        }
      }

      if (h.stateTimer <= 0) {
        h.state = 'walkingBack';
        h.targetX = DESK_POS[name].x;
        h.targetY = DESK_POS[name].y;
        h.stateTimer = 9999;
      }
    } else if (h.state === 'walkingToPet') {
      if (h.targetPet && pets[h.targetPet]) {
        const pet = pets[h.targetPet];
        h.targetX = pet.x + 0.3;
        h.targetY = pet.y - 0.6;
      }
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        h.state = 'playingWithPet';
        h.stateTimer = 150 + Math.random() * 120;
        const petName = h.targetPet || 'dog';
        const lines = PET_PLAY_LINES[name][petName];
        h.speechText = lines[Math.floor(Math.random() * lines.length)];
        h.speechAlpha = 1;
        h.speechTimer = 120;
      }
    } else if (h.state === 'playingWithPet') {
      if (h.stateTimer === Math.floor(h.stateTimer / 100) * 100 && h.stateTimer > 50 && h.speechAlpha <= 0) {
        const petName = h.targetPet || 'dog';
        const lines = PET_PLAY_LINES[name][petName];
        h.speechText = lines[Math.floor(Math.random() * lines.length)];
        h.speechAlpha = 1;
        h.speechTimer = 100;
      }
      if (h.stateTimer <= 0) {
        h.state = 'walkingBack';
        h.targetX = DESK_POS[name].x;
        h.targetY = DESK_POS[name].y;
        h.targetPet = null;
        h.stateTimer = 9999;
      }
    } else if (h.state === 'walkingToBed') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        h.state = 'climbingBed';
        h.stateTimer = 90;
        h._climbProgress = 0;
        h._nextBedState = 'cuddling';
      }
    } else if (h.state === 'climbingBed') {
      h._climbProgress = Math.min(1, (h._climbProgress || 0) + 1 / 90);
      if (h.stateTimer <= 0) {
        if (h._nextBedState === 'cuddling') {
          const other = name === 'boy' ? humans.girl : humans.boy;
          const otherReady = other.state === 'cuddling' || other.state === 'climbingBed';
          if (otherReady) {
            h.state = 'cuddling';
            h.stateTimer = 600;
          } else {
            h.stateTimer = 1; // wait one more frame
          }
        } else {
          h.state = 'sleeping';
          h.stateTimer = 9999;
        }
      }
    } else if (h.state === 'cuddling') {
      if (h.stateTimer <= 0) {
        const schedule = getCurrentSchedule();
        if (schedule === 'boardgame') {
          h.state = 'walkingToGame';
          h.targetX = GAME_POS[name].x;
          h.targetY = GAME_POS[name].y;
        } else if (schedule === 'sleep') {
          h.state = 'walkingToBedForSleep';
          h.targetX = BED_POS[name].x;
          h.targetY = BED_POS[name].y;
        } else {
          h.state = 'walkingBack';
          h.targetX = DESK_POS[name].x;
          h.targetY = DESK_POS[name].y;
        }
        h.stateTimer = 9999;
        // Restore pets from cuddle (trigger once from boy, unless sleeping)
        if (name === 'boy' && schedule !== 'sleep') {
          for (const [pName, pet] of Object.entries(pets)) {
            if (pet.state === 'cuddleLaying' || pet.state === 'cuddleWalking') {
              pet.state = 'walking';
              const target = pickRandomTarget(pName);
              pet.targetX = target.x;
              pet.targetY = target.y;
              pet.stateTimer = 80 + Math.random() * 100;
            }
          }
        }
      }
    } else if (h.state === 'walkingToWorkout') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        h.state = 'workingOut';
        h.stateTimer = 900; // ~15 seconds
      }
    } else if (h.state === 'workingOut') {
      // Stays until toggled off via workout event
    } else if (h.state === 'walkingToGame') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        h.state = 'playingBoardGame';
        h.stateTimer = 200 + Math.random() * 300;
      }
    } else if (h.state === 'playingBoardGame') {
      if (h.stateTimer <= 0 && h.speechAlpha <= 0) {
        if (Math.random() < 0.35) {
          const lines = BOARDGAME_LINES[name];
          h.speechText = lines[Math.floor(Math.random() * lines.length)];
          h.speechAlpha = 1;
          h.speechTimer = 120;
        }
        h.stateTimer = 150 + Math.random() * 250;
      }
    } else if (h.state === 'walkingToBedForSleep') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        h.state = 'climbingBed';
        h.stateTimer = 90;
        h._climbProgress = 0;
        h._nextBedState = 'sleeping';
      }
    } else if (h.state === 'sleeping') {
      // Stay asleep until schedule changes
    } else if (h.state === 'stretching') {
      h.x = DESK_POS[name].x;
      h.y = DESK_POS[name].y;
      if (h.stateTimer <= 0) {
        h.state = 'working';
        h.stateTimer = 250 + Math.random() * 400;
      }
    } else if (h.state === 'walkingToCoffee') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        h.state = 'brewingCoffee';
        h.stateTimer = 180; // ~3 seconds
        h.speechText = name === 'boy' ? 'Coffee time! \u2615' : 'Tea refill! \uD83C\uDF75';
        h.speechAlpha = 1;
        h.speechTimer = 120;
      }
    } else if (h.state === 'brewingCoffee') {
      if (h.stateTimer <= 0) {
        h.state = 'walkingBackWithCoffee';
        h.targetX = DESK_POS[name].x;
        h.targetY = DESK_POS[name].y;
        h.stateTimer = 9999;
      }
    } else if (h.state === 'walkingBackWithCoffee') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        h._hasCoffee = true;
        h._coffeeTimer = 600; // ~10 seconds
        h.state = 'working';
        h.stateTimer = 250 + Math.random() * 400;
      }
    } else if (h.state === 'walkingToDoor') {
      const arrived = moveToward(h, DOOR_POS.x, DOOR_POS.y);
      if (arrived) {
        h.state = 'receivingDelivery';
        h.stateTimer = 120;
        h.speechText = '\uD83D\uDCE6 Thanks!';
        h.speechAlpha = 1;
        h.speechTimer = 100;
      }
    } else if (h.state === 'receivingDelivery') {
      if (h.stateTimer <= 0) {
        h.state = 'walkingBack';
        h.targetX = DESK_POS[name].x;
        h.targetY = DESK_POS[name].y;
        h.stateTimer = 9999;
        deliveryReceiver = null;
      }
    } else if (h.state === 'walkingToDoorForWalk') {
      const arrived = moveToward(h, DOOR_POS.x, DOOR_POS.y);
      if (arrived) {
        h.state = 'outsideWalk';
        h.stateTimer = 900 + Math.random() * 300;
      }
    } else if (h.state === 'outsideWalk') {
      if (h.stateTimer <= 0) {
        h.state = 'walkingBackFromWalk';
        h.x = DOOR_POS.x;
        h.y = DOOR_POS.y;
        h.targetX = DESK_POS[name].x;
        h.targetY = DESK_POS[name].y;
        h.stateTimer = 9999;
        const line = WALK_RETURN_LINES[Math.floor(Math.random() * WALK_RETURN_LINES.length)];
        h.speechText = line;
        h.speechAlpha = 1;
        h.speechTimer = 120;
        if (h._walkPet && pets[h._walkPet]) {
          const pet = pets[h._walkPet];
          pet.state = 'followingBackFromWalk';
          pet.x = DOOR_POS.x + 0.5;
          pet.y = DOOR_POS.y + 0.5;
          pet._followTarget = name;
          pet.stateTimer = 9999;
        }
      }
    } else if (h.state === 'walkingBackFromWalk') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        h._walkPet = null;
        const schedule = getCurrentSchedule();
        if (schedule === 'boardgame') {
          h.state = 'walkingToGame';
          h.targetX = GAME_POS[name].x;
          h.targetY = GAME_POS[name].y;
          h.stateTimer = 9999;
        } else if (schedule === 'sleep') {
          h.state = 'walkingToBedForSleep';
          h.targetX = BED_POS[name].x;
          h.targetY = BED_POS[name].y;
          h.stateTimer = 9999;
        } else {
          h.state = 'working';
          h.stateTimer = 250 + Math.random() * 400;
        }
      }
    } else if (h.state === 'walkingBack') {
      const arrived = moveToward(h, h.targetX, h.targetY);
      if (arrived) {
        const schedule = getCurrentSchedule();
        if (schedule === 'boardgame') {
          h.state = 'walkingToGame';
          h.targetX = GAME_POS[name].x;
          h.targetY = GAME_POS[name].y;
          h.stateTimer = 9999;
        } else if (schedule === 'sleep') {
          h.state = 'walkingToBedForSleep';
          h.targetX = BED_POS[name].x;
          h.targetY = BED_POS[name].y;
          h.stateTimer = 9999;
        } else {
          h.state = 'working';
          h.stateTimer = 250 + Math.random() * 400;
        }
      }
    }
  }
}

function updateThoughts() {
  for (const [who, thought] of Object.entries(thoughts)) {
    if (humans[who].state !== 'working') {
      thought.alpha = 0;
      thought.timer = 200 + Math.random() * 300;
      continue;
    }

    if (thought.alpha > 0) {
      thought.timer--;
      if (thought.timer <= 60) {
        thought.alpha = Math.max(0, thought.timer / 60);
      }
      if (thought.timer <= 0) {
        thought.alpha = 0;
        thought.timer = 300 + Math.random() * 600;
      }
    } else {
      thought.timer--;
      if (thought.timer <= 0) {
        const pool = who === 'boy' ? BOY_THOUGHTS : GIRL_THOUGHTS;
        thought.text = pool[Math.floor(Math.random() * pool.length)];
        thought.alpha = 1;
        thought.timer = 200 + Math.random() * 200;
      }
    }
  }
}
