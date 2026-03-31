// ── Sprites: Miscellaneous (speaker, sticky note, board game, food bowl, delivery person) ──

Object.assign(Sprites, {

  drawSpeaker(ctx, x, y, z, frame, playing) {
    // Speaker box
    Iso.drawBox(ctx, x, y, z, 0.4, 0.3, 0.3, '#2A2A2A', '#1F1F1F', '#151515');
    // Speaker cone
    const cone = Iso.toScreen(x + 0.2, y + 0.31, z + 0.15);
    ctx.fillStyle = '#444'; ctx.beginPath(); ctx.arc(cone.sx, cone.sy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(cone.sx, cone.sy, 3, 0, Math.PI * 2); ctx.fill();
    // Bouncing bars (only when playing)
    if (playing) {
      const barColors = ['#4CAF50', '#66BB6A', '#81C784', '#4DB6AC', '#26C6DA'];
      for (let i = 0; i < 5; i++) {
        const h = 3 + Math.abs(Math.sin(frame * 0.08 + i * 1.2)) * 8;
        const bx = cone.sx - 8 + i * 4;
        ctx.fillStyle = barColors[i];
        ctx.fillRect(bx, cone.sy - 14 - h, 3, h);
      }
    }
  },

  drawStickyNote(ctx, x, y, z, color) {
    // Small colored square on back wall
    const s1 = Iso.toScreen(x, y - 0.02, z);
    const s2 = Iso.toScreen(x + 0.4, y - 0.02, z);
    const s3 = Iso.toScreen(x + 0.4, y - 0.02, z + 0.35);
    const s4 = Iso.toScreen(x, y - 0.02, z + 0.35);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(s1.sx, s1.sy); ctx.lineTo(s2.sx, s2.sy);
    ctx.lineTo(s3.sx, s3.sy); ctx.lineTo(s4.sx, s4.sy); ctx.closePath(); ctx.fill();
    // Shadow edge
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(s1.sx, s1.sy); ctx.lineTo(s2.sx, s2.sy);
    ctx.lineTo(s3.sx, s3.sy); ctx.lineTo(s4.sx, s4.sy); ctx.closePath(); ctx.stroke();
  },

  drawBoardGame(ctx, x, y, z, frame) {
    // Board (flat box)
    Iso.drawBox(ctx, x, y, z, 1.2, 1.0, 0.03, '#F5DEB3', '#E8D1A0', '#DBC490');
    // Board surface border
    Iso.drawBox(ctx, x + 0.05, y + 0.05, z + 0.031, 1.1, 0.9, 0.005, '#C4956A', '#B8895E', '#A87D52');
    // Game pieces (boy's blue)
    const pz = z + 0.035;
    Iso.drawBox(ctx, x + 0.15, y + 0.2, pz, 0.1, 0.1, 0.1, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x + 0.5, y + 0.55, pz, 0.1, 0.1, 0.1, '#3498DB', '#2980B9', '#2471A3');
    // Game pieces (girl's pink)
    Iso.drawBox(ctx, x + 0.8, y + 0.3, pz, 0.1, 0.1, 0.1, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x + 0.4, y + 0.7, pz, 0.1, 0.1, 0.1, '#E91E63', '#C2185B', '#AD1457');
    // Animated moving piece
    const moveX = Math.sin(frame * 0.015) * 0.2 + 0.6;
    const moveY = Math.cos(frame * 0.015) * 0.15 + 0.45;
    Iso.drawBox(ctx, x + moveX, y + moveY, pz, 0.1, 0.1, 0.1, '#F39C12', '#E67E22', '#D35400');
    // Dice
    Iso.drawBox(ctx, x + 1.0, y + 0.12, pz, 0.08, 0.08, 0.08, '#FFF', '#EEE', '#DDD');
    const dotPos = Iso.toScreen(x + 1.04, y + 0.16, pz + 0.081);
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(dotPos.sx, dotPos.sy, 1.2, 0, Math.PI * 2); ctx.fill();
    // Second die
    Iso.drawBox(ctx, x + 0.9, y + 0.08, pz, 0.08, 0.08, 0.08, '#FFF', '#EEE', '#DDD');
  },

  drawFoodBowl(ctx, x, y, z, petName) {
    // Gray bowl
    Iso.drawBox(ctx, x, y, z, 0.3, 0.25, 0.08, '#9E9E9E', '#757575', '#616161');
    // Food inside
    const foodColor = petName === 'frog' ? '#8BC34A' : '#795548';
    Iso.drawBox(ctx, x + 0.04, y + 0.04, z + 0.06, 0.22, 0.17, 0.04, foodColor, Iso.darken(foodColor, 15), Iso.darken(foodColor, 25));
  },

  drawDeliveryPerson(ctx, x, y, z, frame) {
    const legSwing = Math.sin(frame * 0.18) * 0.08;
    // Legs
    Iso.drawBox(ctx, x + 0.05, y + legSwing, 0, 0.13, 0.13, 0.55, '#5D4037', '#4E342E', '#3E2723');
    Iso.drawBox(ctx, x + 0.28, y - legSwing, 0, 0.13, 0.13, 0.55, '#5D4037', '#4E342E', '#3E2723');
    // Shoes
    Iso.drawBox(ctx, x + 0.03, y + legSwing - 0.02, 0, 0.17, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x + 0.26, y - legSwing - 0.02, 0, 0.17, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    // Body (brown uniform)
    Iso.drawBox(ctx, x, y, 0.55, 0.45, 0.3, 0.45, '#8D6E63', '#795548', '#6D4C41');
    // Arms (holding box)
    Iso.drawBox(ctx, x - 0.04, y + 0.05, 0.7, 0.1, 0.12, 0.2, '#8D6E63', '#795548', '#6D4C41');
    Iso.drawBox(ctx, x + 0.4, y + 0.05, 0.7, 0.1, 0.12, 0.2, '#8D6E63', '#795548', '#6D4C41');
    // Cardboard box (held in front)
    Iso.drawBox(ctx, x - 0.02, y - 0.15, 0.65, 0.5, 0.25, 0.3, '#D4A574', '#C4956A', '#B48560');
    // Head
    Iso.drawBox(ctx, x + 0.07, y, 1.0, 0.3, 0.25, 0.3, '#FDBCB4', '#E8A89A', '#D49888');
    // Cap
    Iso.drawBox(ctx, x + 0.04, y - 0.02, 1.25, 0.36, 0.3, 0.08, '#5D4037', '#4E342E', '#3E2723');
    // Cap brim
    Iso.drawBox(ctx, x + 0.04, y - 0.1, 1.25, 0.36, 0.1, 0.03, '#5D4037', '#4E342E', '#3E2723');
  },

});
