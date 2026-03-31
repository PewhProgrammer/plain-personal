// ── Scene rendering (drawScene, drawAmbientLight, drawNightOverlay) ──

function drawScene() {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(camX, camY);
  if (renderScale !== 1) ctx.scale(renderScale, renderScale);

  // Floor
  Sprites.drawFloor(ctx, 0, 0, ROOM_W, ROOM_D);

  // Rug
  Sprites.drawRug(ctx, 4, 4, 4, 3);

  // Walls
  Sprites.drawWalls(ctx, 0, 0, ROOM_W, ROOM_D, WALL_H);

  // Window on back wall (right side) - sky color changes with time
  Sprites.drawWindow(ctx, 9, 0.08, 1.2, getSkyColors(), shootingStar, windowBirds, currentWeather, frame);

  // Picture frames on back wall
  Sprites.drawPictureFrame(ctx, 7.0, 0.08, 2.5, 0.8, 0.6, '#5C4033', '#4A6741');
  Sprites.drawPictureFrame(ctx, 0.5, 0.08, 2.8, 0.6, 0.8, '#2C3E50', '#E8C170');

  // Picture frame on left wall (between closet and door)
  Sprites.drawPictureFrameRotated(ctx, 0.08, 4.8, 2.2, 0.7, 0.5, '#8B4513', '#87CEEB');

  // Photo wall / sticky notes on back wall
  for (let i = 0; i < photoWall.length; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    Sprites.drawStickyNote(ctx, 3.5 + col * 0.5, 0.08, 1.8 + row * 0.4, photoWall[i]);
  }

  // Bookshelves rotated against left wall (spaced evenly)
  Sprites.drawBookshelfRotated(ctx, 0.1, 0.5, 0);
  Sprites.drawDoorRotated(ctx, 0.1, 5.8, 0);

  // Speaker on top of first bookshelf
  Sprites.drawSpeaker(ctx, 0.2, 0.8, 3.0, frame, currentSchedule === 'work');

  // Closet against left wall
  Sprites.drawClosetRotated(ctx, 0.1, 3.5, 0);

  // ── Furniture (back to front) ────────────

  // Desks against back wall, side by side
  // Boy's desk (lowered, z=0.85)
  Sprites.drawBoyDesk(ctx, 1, 0.15, 0.85, frame, currentSchedule, videoCallActive.boy);
  // Girl's standing desk
  Sprites.drawGirlDesk(ctx, 5, 0.15, 1.5, frame, currentSchedule, videoCallActive.girl, plantGrowthLevel);

  // Coffee machine against back wall
  Sprites.drawCoffeeMachine(ctx, 8, 0.15, 0);

  // Chair for boy
  Sprites.drawChair(ctx, 2.5, 1.8, 0);

  // Bed (right area)
  Sprites.drawBed(ctx, 8, 5, 0);

  // Floor lamps (two corners)
  Sprites.drawFloorLamp(ctx, 0.5, 9, 0);
  Sprites.drawFloorLamp(ctx, 11, 9, 0);

  // Desk lamps
  Sprites.drawDeskLamp(ctx, 4.1, 1.05, 0.93);
  Sprites.drawDeskLamp(ctx, 5.05, 0.95, 1.56);

  // Weight rack (against right wall)
  Sprites.drawWeightRack(ctx, 10.8, 4, 0);

  // Dumbbells on floor (near workout area)
  Sprites.drawFloorDumbbell(ctx, 5.5, 6.2, 0);
  Sprites.drawFloorDumbbell(ctx, 6.8, 6.0, 0);

  // ── Collect all drawable entities for depth sorting ────────
  const entities = [];

  // Characters
  const boy = humans.boy;
  const girl = humans.girl;

  const boyAtDesk = (boy.state === 'working');
  const girlAtDesk = (girl.state === 'working');
  const boyWorkingOut = boy.state === 'workingOut';
  const boyStretching = boy.state === 'stretching';
  const girlStretching = girl.state === 'stretching';
  const boyBrewing = boy.state === 'brewingCoffee';
  const girlBrewing = girl.state === 'brewingCoffee';
  const boyWalking = (boy.state === 'walkingToPartner' || boy.state === 'walkingToPet' || boy.state === 'walkingBack' || boy.state === 'walkingToBed' || boy.state === 'walkingToWorkout' || boy.state === 'walkingToGame' || boy.state === 'walkingToBedForSleep' || boy.state === 'walkingToCoffee' || boy.state === 'walkingBackWithCoffee' || boy.state === 'walkingToDoor' || boy.state === 'walkingToDoorForWalk' || boy.state === 'walkingBackFromWalk');
  const girlWalking = (girl.state === 'walkingToPartner' || girl.state === 'walkingToPet' || girl.state === 'walkingBack' || girl.state === 'walkingToBed' || girl.state === 'walkingToGame' || girl.state === 'walkingToBedForSleep' || girl.state === 'walkingToCoffee' || girl.state === 'walkingBackWithCoffee' || girl.state === 'walkingToDoor' || girl.state === 'walkingToDoorForWalk' || girl.state === 'walkingBackFromWalk');
  const boyClimbing = boy.state === 'climbingBed';
  const girlClimbing = girl.state === 'climbingBed';
  const boyCuddling = boy.state === 'cuddling';
  const girlCuddling = girl.state === 'cuddling';
  const boyBoardGame = boy.state === 'playingBoardGame';
  const girlBoardGame = girl.state === 'playingBoardGame';
  const boySleeping = boy.state === 'sleeping';
  const girlSleeping = girl.state === 'sleeping';

  entities.push({
    depth: boy.x + boy.y,
    draw: () => {
      if (boy.state === 'outsideWalk') return;
      // Shadow (skip when at desk or lying down)
      if (!boyAtDesk && !boyCuddling && !boySleeping && !boyClimbing) {
        Sprites._drawShadow(ctx, boy.x + 0.25, boy.y + 0.1, 12, 6, 0.1);
      }
      if (boyAtDesk) {
        Sprites.drawBoy(ctx, boy.x, boy.y, DESK_POS.boy.z, frame);
      } else if (boyClimbing) {
        const climbZ = (boy._climbProgress || 0) * BED_SURFACE_Z;
        Sprites.drawBoyWalking(ctx, boy.x, boy.y, climbZ, 0, boy.dir);
      } else if (boyStretching) {
        Sprites.drawBoyStretching(ctx, boy.x, boy.y, 0, frame);
      } else if (boyBrewing) {
        Sprites.drawBoyWalking(ctx, boy.x, boy.y, 0, 0, boy.dir);
      } else if (boyWalking) {
        Sprites.drawBoyWalking(ctx, boy.x, boy.y, 0, frame, boy.dir);
      } else if (boyCuddling) {
        Sprites.drawBoyLying(ctx, boy.x, boy.y, BED_SURFACE_Z, frame);
      } else if (boyWorkingOut) {
        Sprites.drawBoyWorkout(ctx, boy.x, boy.y, 0, frame);
      } else if (boyBoardGame) {
        Sprites.drawBoySittingFloor(ctx, boy.x, boy.y, 0, frame);
      } else if (boySleeping) {
        Sprites.drawBoyLying(ctx, boy.x, boy.y, BED_SURFACE_Z, frame);
      } else if (boy.state === 'receivingDelivery') {
        Sprites.drawBoyWalking(ctx, boy.x, boy.y, 0, 0, boy.dir);
      } else {
        Sprites.drawBoyWalking(ctx, boy.x, boy.y, 0, 0, boy.dir);
      }
      if (boy.speechAlpha > 0) {
        const headZ = boyAtDesk ? DESK_POS.boy.z + 1.3 : (boyBoardGame ? 1.0 : 1.6);
        Sprites.drawSpeechBubble(ctx, boy.x, boy.y, headZ, boy.speechText, boy.speechAlpha);
      }
      if (boyAtDesk && thoughts.boy.alpha > 0) {
        Sprites.drawThoughtBubble(ctx, boy.x, boy.y, 2.0, thoughts.boy.text, thoughts.boy.alpha);
      }
      // Mood emoji (during working, no thought bubble)
      if (boyAtDesk && thoughts.boy.alpha <= 0 && boy.speechAlpha <= 0) {
        const emoji = getMoodEmoji();
        if (emoji) {
          const mp = Iso.toScreen(boy.x + 0.25, boy.y, DESK_POS.boy.z + 1.5);
          const float = Math.sin(frame * 0.04) * 3;
          ctx.font = '12px serif'; ctx.textAlign = 'center';
          ctx.fillText(emoji, mp.sx, mp.sy - 5 + float);
          ctx.textAlign = 'left';
        }
      }
      // Coffee steam on desk mug
      if (boy._hasCoffee && boy._coffeeTimer > 0 && boyAtDesk) {
        Sprites._drawSteam(ctx, 1.4, 1.3, 0.93 + 0.25, frame);
      }
      // Notification dots
      if (notifications.boy.length > 0 && boyAtDesk) {
        for (let ni = 0; ni < notifications.boy.length; ni++) {
          const notif = notifications.boy[ni];
          const pulse = 1 + Math.sin(frame * 0.1 + ni * 2) * 0.3;
          const np = Iso.toScreen(1.3 + 1.0 * ni + 0.85, 0.15 - 0.01, 0.85 + 0.08 + 0.95);
          ctx.fillStyle = notif.color;
          ctx.beginPath(); ctx.arc(np.sx, np.sy, 3 * pulse, 0, Math.PI * 2); ctx.fill();
        }
      }
      // Floating heart when cuddling
      if (boyCuddling) {
        const heartPos = Iso.toScreen(9.5, 5.9, BED_SURFACE_Z + 1.0);
        const float = Math.sin(frame * 0.06) * 5;
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#E91E63';
        ctx.fillText('\u2764\uFE0F', heartPos.sx, heartPos.sy - 10 + float);
        ctx.textAlign = 'left';
      }
      // Zzz when sleeping
      if (boySleeping) {
        const zzzPos = Iso.toScreen(boy.x + 0.5, boy.y + 0.1, BED_SURFACE_Z + 0.6);
        Sprites._drawZzz(ctx, zzzPos, frame);
      }
    },
  });

  entities.push({
    depth: girl.x + girl.y,
    draw: () => {
      if (girl.state === 'outsideWalk') return;
      // Shadow
      if (!girlAtDesk && !girlCuddling && !girlSleeping && !girlClimbing) {
        Sprites._drawShadow(ctx, girl.x + 0.22, girl.y + 0.1, 11, 5.5, 0.1);
      }
      if (girlAtDesk) {
        Sprites.drawGirl(ctx, girl.x, girl.y, 0, frame);
      } else if (girlClimbing) {
        const climbZ = (girl._climbProgress || 0) * BED_SURFACE_Z;
        Sprites.drawGirlWalking(ctx, girl.x, girl.y, climbZ, 0, girl.dir);
      } else if (girlStretching) {
        Sprites.drawGirlStretching(ctx, girl.x, girl.y, 0, frame);
      } else if (girlBrewing) {
        Sprites.drawGirlWalking(ctx, girl.x, girl.y, 0, 0, girl.dir);
      } else if (girlWalking) {
        Sprites.drawGirlWalking(ctx, girl.x, girl.y, 0, frame, girl.dir);
      } else if (girlCuddling) {
        Sprites.drawGirlLying(ctx, girl.x, girl.y, BED_SURFACE_Z, frame);
      } else if (girlBoardGame) {
        Sprites.drawGirlSittingFloor(ctx, girl.x, girl.y, 0, frame);
      } else if (girlSleeping) {
        Sprites.drawGirlLying(ctx, girl.x, girl.y, BED_SURFACE_Z, frame);
      } else if (girl.state === 'receivingDelivery') {
        Sprites.drawGirlWalking(ctx, girl.x, girl.y, 0, 0, girl.dir);
      } else {
        Sprites.drawGirlWalking(ctx, girl.x, girl.y, 0, 0, girl.dir);
      }
      // Speech bubble
      if (girl.speechAlpha > 0) {
        const headZ = girlBoardGame ? 0.9 : 1.7;
        Sprites.drawSpeechBubble(ctx, girl.x, girl.y, headZ, girl.speechText, girl.speechAlpha);
      }
      // Thought bubble
      if (girlAtDesk && thoughts.girl.alpha > 0) {
        Sprites.drawThoughtBubble(ctx, girl.x, girl.y, 2.2, thoughts.girl.text, thoughts.girl.alpha);
      }
      // Mood emoji
      if (girlAtDesk && thoughts.girl.alpha <= 0 && girl.speechAlpha <= 0) {
        const emoji = getMoodEmoji();
        if (emoji) {
          const mp = Iso.toScreen(girl.x + 0.22, girl.y, 2.3);
          const float = Math.sin(frame * 0.04 + 1) * 3;
          ctx.font = '12px serif'; ctx.textAlign = 'center';
          ctx.fillText(emoji, mp.sx, mp.sy - 5 + float);
          ctx.textAlign = 'left';
        }
      }
      // Coffee steam
      if (girl._hasCoffee && girl._coffeeTimer > 0 && girlAtDesk) {
        Sprites._drawSteam(ctx, 6.9, 1.0, 1.56 + 0.26, frame);
      }
      // Notification dots
      if (notifications.girl.length > 0 && girlAtDesk) {
        for (let ni = 0; ni < notifications.girl.length; ni++) {
          const notif = notifications.girl[ni];
          const pulse = 1 + Math.sin(frame * 0.1 + ni * 2 + 1) * 0.3;
          const np = Iso.toScreen(5.7 + 0.9, 0.15 - 0.01, 1.56 + 0.06 + 0.95);
          ctx.fillStyle = notif.color;
          ctx.beginPath(); ctx.arc(np.sx + ni * 8, np.sy, 3 * pulse, 0, Math.PI * 2); ctx.fill();
        }
      }
      // Zzz when sleeping
      if (girlSleeping) {
        const zzzPos = Iso.toScreen(girl.x + 0.5, girl.y + 0.1, BED_SURFACE_Z + 0.6);
        Sprites._drawZzz(ctx, zzzPos, frame + 30);
      }
    },
  });

  // Board game (only during board game time)
  if (currentSchedule === 'boardgame') {
    entities.push({
      depth: BOARDGAME_POS.x + BOARDGAME_POS.y,
      draw: () => Sprites.drawBoardGame(ctx, BOARDGAME_POS.x, BOARDGAME_POS.y, 0, frame),
    });
  }

  // Plants
  entities.push({ depth: 1.5 + 8, draw: () => Sprites.drawPlant(ctx, 1.5, 8, 0, 0, frame) });
  entities.push({ depth: 10 + 1, draw: () => Sprites.drawPlant(ctx, 10, 1, 0, 1, frame) });
  entities.push({ depth: 3.0 + 8.5, draw: () => Sprites.drawPlant(ctx, 3.0, 8.5, 0, 2, frame) });
  entities.push({ depth: 9.5 + 8.5, draw: () => Sprites.drawPlant(ctx, 9.5, 8.5, 0, 3, frame) });

  // Pet bed
  entities.push({ depth: 5 + 8, draw: () => Sprites.drawPetBed(ctx, 5, 8, 0) });

  // Seasonal decorations
  if (CURRENT_MONTH === 11) { // December
    entities.push({ depth: 10.5 + 3, draw: () => Sprites.drawChristmasTree(ctx, 10.5, 3, 0, frame) });
  } else if (CURRENT_MONTH === 9) { // October
    entities.push({ depth: 10.5 + 3, draw: () => Sprites.drawPumpkins(ctx, 10.5, 3, 0) });
  }

  // Food bowls during feeding
  if (feedingActive) {
    for (const [pName, pos] of Object.entries(FOOD_BOWL_POS)) {
      entities.push({ depth: pos.x + pos.y, draw: () => Sprites.drawFoodBowl(ctx, pos.x, pos.y, 0, pName) });
    }
  }

  // Delivery person
  if (deliveryPerson) {
    entities.push({
      depth: deliveryPerson.x + deliveryPerson.y,
      draw: () => Sprites.drawDeliveryPerson(ctx, deliveryPerson.x, deliveryPerson.y, 0, frame),
    });
  }

  // Pets
  for (const [name, pet] of Object.entries(pets)) {
    entities.push({
      depth: pet.x + pet.y,
      draw: () => {
        if (pet.state === 'outsideWalk') return;
        const drawState = (pet.state === 'idle' || pet.state === 'cuddleWalking' || pet.state === 'walkingToSleep' || pet.state === 'stalking' || pet.state === 'chasing' || pet.state === 'fleeing' || pet.state === 'followingForWalk' || pet.state === 'followingBackFromWalk' || pet.state === 'jumpingOnBed') ? 'walking' :
                          (pet.state === 'cuddleLaying') ? 'laying' :
                          (pet.state === 'zoomies') ? 'walking' :
                          (pet.state === 'knocking' || pet.state === 'tongueCatch' || pet.state === 'eating') ? 'idle' :
                          pet.state;
        if (name === 'dog') Sprites.drawDog(ctx, pet.x, pet.y, pet.z, frame, pet.dir, drawState);
        if (name === 'cat') Sprites.drawCat(ctx, pet.x, pet.y, pet.z, frame, pet.dir, drawState);
        if (name === 'frog') Sprites.drawFrog(ctx, pet.x, pet.y, pet.z, frame, pet.dir, drawState);
        // Rare animation overlays
        if (name === 'dog' && pet.state === 'zoomies') {
          const excl = Iso.toScreen(pet.x + 0.3, pet.y + 0.1, pet.z + 0.6);
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#FF5722';
          ctx.fillText('!', excl.sx, excl.sy - Math.sin(frame * 0.3) * 3);
        }
        if (name === 'cat' && pet.state === 'knocking') {
          const swipe = Math.sin(frame * 0.15);
          if (swipe > 0) {
            const pawPos = Iso.toScreen(pet.x + pet.dir * 0.4, pet.y + 0.15, pet.z + 0.1);
            ctx.strokeStyle = 'rgba(200,200,200,0.5)'; ctx.lineWidth = 1;
            for (let s = 0; s < 3; s++) {
              ctx.beginPath();
              ctx.moveTo(pawPos.sx + s * 3, pawPos.sy - 4);
              ctx.lineTo(pawPos.sx + s * 3 + 4, pawPos.sy + 4);
              ctx.stroke();
            }
          }
        }
        if (name === 'frog' && pet.state === 'tongueCatch') {
          const tongueLen = Math.abs(Math.sin(frame * 0.1)) * 25;
          const base = Iso.toScreen(pet.x + 0.15 + pet.dir * 0.1, pet.y + 0.12, pet.z + 0.12);
          ctx.strokeStyle = '#FF6B8A'; ctx.lineWidth = 2; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(base.sx, base.sy);
          ctx.lineTo(base.sx + pet.dir * tongueLen, base.sy - tongueLen * 0.3);
          ctx.stroke();
          if (tongueLen > 15) {
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(base.sx + pet.dir * tongueLen, base.sy - tongueLen * 0.3, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      },
    });
  }

  // Sort back to front and draw
  entities.sort((a, b) => a.depth - b.depth);
  for (const e of entities) e.draw();

  // Ambient light
  drawAmbientLight();

  ctx.restore();
}

function drawAmbientLight() {
  if (!lightCanvas) {
    lightCanvas = document.createElement('canvas');
    lightCtx = lightCanvas.getContext('2d');
  }

  if (lightDirty || lightCanvas.width !== canvas.width || lightCanvas.height !== canvas.height) {
    lightCanvas.width = canvas.width;
    lightCanvas.height = canvas.height;
    const lc = lightCtx;

    // Apply same camera transform as main canvas
    lc.translate(camX, camY);
    if (renderScale !== 1) lc.scale(renderScale, renderScale);

    // Dark overlay (slightly dimmed)
    lc.fillStyle = 'rgba(5, 5, 20, 0.28)';
    lc.fillRect(-2000, -2000, 5000, 5000);

    // Additive light sources
    lc.globalCompositeOperation = 'lighter';

    // Floor lamp 1 (front-left corner)
    const lamp1 = Iso.toScreen(0.65, 9.15, 0.5);
    const glow1 = lc.createRadialGradient(lamp1.sx, lamp1.sy - 15, 5, lamp1.sx, lamp1.sy + 30, 280);
    glow1.addColorStop(0, 'rgba(255, 210, 120, 0.28)');
    glow1.addColorStop(0.25, 'rgba(255, 190, 100, 0.14)');
    glow1.addColorStop(0.6, 'rgba(255, 170, 80, 0.05)');
    glow1.addColorStop(1, 'rgba(255, 150, 60, 0)');
    lc.fillStyle = glow1;
    lc.fillRect(-2000, -2000, 5000, 5000);

    // Floor lamp 2 (front-right corner)
    const lamp2 = Iso.toScreen(11.15, 9.15, 0.5);
    const glow2 = lc.createRadialGradient(lamp2.sx, lamp2.sy - 15, 5, lamp2.sx, lamp2.sy + 30, 280);
    glow2.addColorStop(0, 'rgba(255, 210, 120, 0.28)');
    glow2.addColorStop(0.25, 'rgba(255, 190, 100, 0.14)');
    glow2.addColorStop(0.6, 'rgba(255, 170, 80, 0.05)');
    glow2.addColorStop(1, 'rgba(255, 150, 60, 0)');
    lc.fillStyle = glow2;
    lc.fillRect(-2000, -2000, 5000, 5000);

    // Boy's desk lamp glow (warm)
    const dLamp1 = Iso.toScreen(4.17, 1.12, 1.3);
    const dGlow1 = lc.createRadialGradient(dLamp1.sx, dLamp1.sy, 3, dLamp1.sx, dLamp1.sy + 15, 120);
    dGlow1.addColorStop(0, 'rgba(255, 220, 140, 0.12)');
    dGlow1.addColorStop(0.4, 'rgba(255, 200, 110, 0.06)');
    dGlow1.addColorStop(1, 'rgba(255, 180, 80, 0)');
    lc.fillStyle = dGlow1;
    lc.fillRect(-2000, -2000, 5000, 5000);

    // Girl's desk lamp glow (warm)
    const dLamp2 = Iso.toScreen(5.12, 1.02, 1.93);
    const dGlow2 = lc.createRadialGradient(dLamp2.sx, dLamp2.sy, 3, dLamp2.sx, dLamp2.sy + 15, 120);
    dGlow2.addColorStop(0, 'rgba(255, 220, 140, 0.12)');
    dGlow2.addColorStop(0.4, 'rgba(255, 200, 110, 0.06)');
    dGlow2.addColorStop(1, 'rgba(255, 180, 80, 0)');
    lc.fillStyle = dGlow2;
    lc.fillRect(-2000, -2000, 5000, 5000);

    // Window sunlight beam
    const sunFloor = Iso.toScreen(9.5, 2, 0);
    const sunGlow = lc.createRadialGradient(sunFloor.sx, sunFloor.sy, 20, sunFloor.sx - 60, sunFloor.sy + 80, 280);
    sunGlow.addColorStop(0, 'rgba(255, 250, 220, 0.16)');
    sunGlow.addColorStop(0.3, 'rgba(255, 245, 200, 0.09)');
    sunGlow.addColorStop(0.6, 'rgba(255, 240, 180, 0.03)');
    sunGlow.addColorStop(1, 'rgba(255, 235, 160, 0)');
    lc.fillStyle = sunGlow;
    lc.fillRect(-2000, -2000, 5000, 5000);

    // Sunlight floor patch
    const patch = Iso.toScreen(8.5, 2.5, 0);
    const patchGlow = lc.createRadialGradient(patch.sx, patch.sy, 5, patch.sx, patch.sy, 120);
    patchGlow.addColorStop(0, 'rgba(255, 248, 210, 0.10)');
    patchGlow.addColorStop(0.5, 'rgba(255, 245, 200, 0.04)');
    patchGlow.addColorStop(1, 'rgba(255, 240, 180, 0)');
    lc.fillStyle = patchGlow;
    lc.fillRect(-2000, -2000, 5000, 5000);

    // Monitor glows
    const monPos = Iso.toScreen(2.5, 0.5, 1.3);
    const monGlow = lc.createRadialGradient(monPos.sx, monPos.sy, 3, monPos.sx, monPos.sy, 100);
    monGlow.addColorStop(0, 'rgba(80, 160, 255, 0.06)');
    monGlow.addColorStop(1, 'rgba(80, 160, 255, 0)');
    lc.fillStyle = monGlow;
    lc.fillRect(-2000, -2000, 5000, 5000);

    const gMonPos = Iso.toScreen(6.2, 0.3, 1.8);
    const gMonGlow = lc.createRadialGradient(gMonPos.sx, gMonPos.sy, 3, gMonPos.sx, gMonPos.sy, 70);
    gMonGlow.addColorStop(0, 'rgba(80, 160, 255, 0.04)');
    gMonGlow.addColorStop(1, 'rgba(80, 160, 255, 0)');
    lc.fillStyle = gMonGlow;
    lc.fillRect(-2000, -2000, 5000, 5000);

    lc.globalCompositeOperation = 'source-over';
    lightDirty = false;
  }

  // Draw cached lighting layer (fast - just one drawImage per frame)
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(lightCanvas, 0, 0);
  ctx.restore();

  // RGB glow — only during work hours
  if (currentSchedule === 'work') {
    ctx.save();
    ctx.translate(camX, camY);
    if (renderScale !== 1) ctx.scale(renderScale, renderScale);
    ctx.globalCompositeOperation = 'lighter';
    const rgbPos = Iso.toScreen(2.3, 0.5, 1.1);
    const rgbGlow = ctx.createRadialGradient(rgbPos.sx, rgbPos.sy, 5, rgbPos.sx, rgbPos.sy + 20, 150);
    rgbGlow.addColorStop(0, 'rgba(100, 80, 180, 0.06)');
    rgbGlow.addColorStop(0.5, 'rgba(100, 80, 180, 0.02)');
    rgbGlow.addColorStop(1, 'rgba(100, 80, 180, 0)');
    ctx.fillStyle = rgbGlow;
    ctx.fillRect(-2000, -2000, 5000, 5000);
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }
}

function drawNightOverlay() {
  const alpha = getDayNightAlpha();
  if (alpha > 0) {
    ctx.fillStyle = `rgba(10, 10, 40, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Lightning flash (after night overlay)
  if (lightningFlash > 0) {
    const flashAlpha = (lightningFlash / 8) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Cherry blossom petals (spring: March-May)
  if (CURRENT_MONTH >= 2 && CURRENT_MONTH <= 4) {
    Sprites.drawCherryBlossomPetals(ctx, frame);
  }
}
