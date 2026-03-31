// ── Sprites: Pets (dog, cat, frog) ──────────────────────────────

Object.assign(Sprites, {

  drawDog(ctx, x, y, z, frame, dir, state) {
    dir = dir || 1; state = state || 'walking';
    const wag = Math.sin(frame * 0.15) * 0.08;
    const breathe = Math.sin(frame * 0.06) * 0.01;
    const col = '#D4A574';
    if (state === 'sleeping' || state === 'laying') {
      const flatZ = 0.02;
      Iso.drawBox(ctx, x, y, flatZ + breathe, 0.6, 0.4, 0.18, Iso.lighten(col, 15), col, Iso.darken(col, 20));
      const hx = dir > 0 ? x + 0.45 : x - 0.15;
      Iso.drawBox(ctx, hx, y + 0.08, flatZ + breathe, 0.22, 0.22, 0.15, Iso.lighten(col, 20), Iso.lighten(col, 5), Iso.darken(col, 15));
      const sx2 = dir > 0 ? hx + 0.18 : hx - 0.08;
      Iso.drawBox(ctx, sx2, y + 0.12, flatZ + breathe, 0.1, 0.12, 0.08, Iso.lighten(col, 30), Iso.lighten(col, 15), col);
      Iso.drawBox(ctx, hx + 0.02, y + 0.01, flatZ + 0.12 + breathe, 0.08, 0.06, 0.08, Iso.darken(col, 25), Iso.darken(col, 30), Iso.darken(col, 35));
      Iso.drawBox(ctx, hx + 0.02, y + 0.28, flatZ + 0.12 + breathe, 0.08, 0.06, 0.08, Iso.darken(col, 25), Iso.darken(col, 30), Iso.darken(col, 35));
      const tailX = dir > 0 ? x - 0.05 : x + 0.55;
      const tb = Iso.toScreen(tailX, y + 0.18, flatZ + 0.1);
      const te = Iso.toScreen(tailX + (dir > 0 ? -0.15 : 0.15), y + 0.18, flatZ + 0.05);
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(tb.sx, tb.sy); ctx.lineTo(te.sx, te.sy); ctx.stroke();
      const eLx = dir > 0 ? hx + 0.15 : hx + 0.05;
      const eL = Iso.toScreen(eLx, y + 0.1, flatZ + 0.18 + breathe);
      const eR = Iso.toScreen(eLx, y + 0.23, flatZ + 0.18 + breathe);
      if (state === 'sleeping') {
        ctx.strokeStyle = '#2D2D2D'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(eL.sx - 2, eL.sy); ctx.lineTo(eL.sx + 2, eL.sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(eR.sx - 2, eR.sy); ctx.lineTo(eR.sx + 2, eR.sy); ctx.stroke();
        this._drawZzz(ctx, Iso.toScreen(hx + 0.1, y + 0.1, flatZ + 0.35), frame);
      } else {
        ctx.fillStyle = '#2D2D2D';
        ctx.beginPath(); ctx.arc(eL.sx, eL.sy, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eR.sx, eR.sy, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    // Shadow
    this._drawShadow(ctx, x + 0.3, y + 0.17, 14, 7, 0.08);
    if (state === 'playing') z = z + Math.abs(Math.sin(frame * 0.12)) * 0.15;
    const legAnim = state === 'walking' ? Math.sin(frame * 0.12) * 0.04 : 0;
    Iso.drawBox(ctx, x, y, z + breathe, 0.6, 0.35, 0.3, Iso.lighten(col, 15), col, Iso.darken(col, 20));
    const headX = dir > 0 ? x + 0.5 : x - 0.15;
    Iso.drawBox(ctx, headX, y + 0.05, z + 0.15 + breathe, 0.25, 0.25, 0.25, Iso.lighten(col, 20), Iso.lighten(col, 5), Iso.darken(col, 15));
    const snoutX = dir > 0 ? headX + 0.2 : headX - 0.08;
    Iso.drawBox(ctx, snoutX, y + 0.1, z + 0.15 + breathe, 0.12, 0.15, 0.12, Iso.lighten(col, 30), Iso.lighten(col, 15), col);
    const noseX = dir > 0 ? snoutX + 0.12 : snoutX - 0.02;
    const nose = Iso.toScreen(noseX, y + 0.17, z + 0.27 + breathe);
    ctx.fillStyle = '#2D2D2D';
    ctx.beginPath(); ctx.arc(nose.sx, nose.sy, 2.5, 0, Math.PI * 2); ctx.fill();
    Iso.drawBox(ctx, headX + 0.02, y - 0.02, z + 0.35 + breathe, 0.1, 0.08, 0.15, Iso.darken(col, 25), Iso.darken(col, 30), Iso.darken(col, 35));
    Iso.drawBox(ctx, headX + 0.02, y + 0.28, z + 0.35 + breathe, 0.1, 0.08, 0.15, Iso.darken(col, 25), Iso.darken(col, 30), Iso.darken(col, 35));
    const legC = Iso.darken(col, 10);
    const fl = legAnim; const bl = -legAnim;
    Iso.drawBox(ctx, x + 0.05 + fl * dir, y + 0.03, 0, 0.08, 0.08, z, legC, Iso.darken(legC, 10), Iso.darken(legC, 20));
    Iso.drawBox(ctx, x + 0.05 + bl * dir, y + 0.22, 0, 0.08, 0.08, z, legC, Iso.darken(legC, 10), Iso.darken(legC, 20));
    Iso.drawBox(ctx, x + 0.4 + bl * dir, y + 0.03, 0, 0.08, 0.08, z, legC, Iso.darken(legC, 10), Iso.darken(legC, 20));
    Iso.drawBox(ctx, x + 0.4 + fl * dir, y + 0.22, 0, 0.08, 0.08, z, legC, Iso.darken(legC, 10), Iso.darken(legC, 20));
    const wagAmt = state === 'playing' ? wag * 2 : wag;
    const tailBX = dir > 0 ? x - 0.05 : x + 0.6;
    const tailEX = dir > 0 ? x - 0.2 : x + 0.8;
    const tailB = Iso.toScreen(tailBX, y + 0.15, z + 0.25);
    const tailE = Iso.toScreen(tailEX, y + 0.15 + wagAmt, z + 0.4);
    ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(tailB.sx, tailB.sy);
    ctx.quadraticCurveTo((tailB.sx + tailE.sx) / 2, tailE.sy + 3, tailE.sx, tailE.sy); ctx.stroke();
    const eyeBX = dir > 0 ? headX + 0.15 : headX + 0.08;
    const eyeL = Iso.toScreen(eyeBX, y + 0.08, z + 0.32 + breathe);
    const eyeR = Iso.toScreen(eyeBX, y + 0.22, z + 0.32 + breathe);
    ctx.fillStyle = '#2D2D2D';
    ctx.beginPath(); ctx.arc(eyeL.sx, eyeL.sy, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eyeR.sx, eyeR.sy, 2, 0, Math.PI * 2); ctx.fill();
    if (state === 'playing') {
      const tongX = dir > 0 ? snoutX + 0.08 : snoutX;
      const t = Iso.toScreen(tongX, y + 0.16, z + 0.14 + breathe);
      ctx.fillStyle = '#FF6B8A';
      ctx.beginPath(); ctx.ellipse(t.sx, t.sy, 2, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    }
  },

  drawCat(ctx, x, y, z, frame, dir, state) {
    dir = dir || 1; state = state || 'walking';
    const breathe = Math.sin(frame * 0.04) * 0.015;
    const tailSwish = Math.sin(frame * 0.08) * 0.12;
    const col = '#FF9800';
    if (state === 'sleeping' || state === 'laying') {
      Iso.drawBox(ctx, x, y, 0.02 + breathe, 0.4, 0.35, 0.2, Iso.lighten(col, 15), col, Iso.darken(col, 25));
      const hx = dir > 0 ? x + 0.25 : x - 0.08;
      Iso.drawBox(ctx, hx, y + 0.06, 0.1 + breathe, 0.18, 0.2, 0.18, Iso.lighten(col, 20), Iso.lighten(col, 5), Iso.darken(col, 15));
      const earPt = Iso.toScreen(hx + 0.12, y + 0.04, 0.32 + breathe);
      const earPt2 = Iso.toScreen(hx + 0.12, y + 0.22, 0.32 + breathe);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(earPt.sx - 3, earPt.sy + 2); ctx.lineTo(earPt.sx, earPt.sy - 4); ctx.lineTo(earPt.sx + 3, earPt.sy + 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(earPt2.sx - 3, earPt2.sy + 2); ctx.lineTo(earPt2.sx, earPt2.sy - 4); ctx.lineTo(earPt2.sx + 3, earPt2.sy + 2); ctx.fill();
      const tc = Iso.toScreen(x + 0.35, y + 0.3, 0.08);
      const tc2 = Iso.toScreen(x + 0.1, y + 0.35, 0.05);
      const tc3 = Iso.toScreen(x - 0.05, y + 0.25, 0.05);
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(tc.sx, tc.sy); ctx.quadraticCurveTo(tc2.sx, tc2.sy, tc3.sx, tc3.sy); ctx.stroke();
      const eBase = hx + (dir > 0 ? 0.14 : 0.02);
      const eL = Iso.toScreen(eBase, y + 0.09, 0.22 + breathe);
      const eR = Iso.toScreen(eBase, y + 0.19, 0.22 + breathe);
      if (state === 'sleeping') {
        ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(eL.sx - 2, eL.sy); ctx.lineTo(eL.sx + 2, eL.sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(eR.sx - 2, eR.sy); ctx.lineTo(eR.sx + 2, eR.sy); ctx.stroke();
        this._drawZzz(ctx, Iso.toScreen(hx + 0.05, y + 0.08, 0.4), frame);
      } else {
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath(); ctx.arc(eL.sx, eL.sy, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eR.sx, eR.sy, 2, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    // Shadow
    this._drawShadow(ctx, x + 0.25, y + 0.17, 12, 6, 0.08);
    if (state === 'playing') z = z + Math.abs(Math.sin(frame * 0.15)) * 0.1;
    const legAnim = state === 'walking' ? Math.sin(frame * 0.14) * 0.03 : 0;
    Iso.drawBox(ctx, x, y, z + breathe, 0.5, 0.35, 0.25, Iso.lighten(col, 15), col, Iso.darken(col, 25));
    const headX = dir > 0 ? x + 0.35 : x - 0.08;
    Iso.drawBox(ctx, headX, y + 0.05, z + 0.12 + breathe, 0.22, 0.22, 0.22, Iso.lighten(col, 20), Iso.lighten(col, 5), Iso.darken(col, 15));
    const earBaseX = headX + 0.08;
    const earL = Iso.toScreen(earBaseX, y + 0.03, z + 0.38 + breathe);
    const earLT = Iso.toScreen(earBaseX + 0.03, y + 0.0, z + 0.5 + breathe);
    const earLR = Iso.toScreen(earBaseX + 0.06, y + 0.08, z + 0.38 + breathe);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(earL.sx, earL.sy); ctx.lineTo(earLT.sx, earLT.sy); ctx.lineTo(earLR.sx, earLR.sy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath(); ctx.moveTo(earL.sx + 1, earL.sy); ctx.lineTo(earLT.sx, earLT.sy + 2); ctx.lineTo(earLR.sx - 1, earLR.sy); ctx.closePath(); ctx.fill();
    const earR = Iso.toScreen(earBaseX, y + 0.22, z + 0.38 + breathe);
    const earRT = Iso.toScreen(earBaseX + 0.03, y + 0.25, z + 0.5 + breathe);
    const earRR = Iso.toScreen(earBaseX + 0.06, y + 0.18, z + 0.38 + breathe);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(earR.sx, earR.sy); ctx.lineTo(earRT.sx, earRT.sy); ctx.lineTo(earRR.sx, earRR.sy); ctx.closePath(); ctx.fill();
    const eyeX = dir > 0 ? headX + 0.16 : headX + 0.04;
    const eyeL2 = Iso.toScreen(eyeX, y + 0.09, z + 0.28 + breathe);
    const eyeR2 = Iso.toScreen(eyeX, y + 0.2, z + 0.28 + breathe);
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath(); ctx.arc(eyeL2.sx, eyeL2.sy, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eyeR2.sx, eyeR2.sy, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(eyeL2.sx - 0.5, eyeL2.sy - 2, 1.5, 4);
    ctx.fillRect(eyeR2.sx - 0.5, eyeR2.sy - 2, 1.5, 4);
    const noseX = dir > 0 ? headX + 0.2 : headX;
    const catNose = Iso.toScreen(noseX, y + 0.14, z + 0.23 + breathe);
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath(); ctx.moveTo(catNose.sx, catNose.sy - 1.5); ctx.lineTo(catNose.sx - 2, catNose.sy + 1); ctx.lineTo(catNose.sx + 2, catNose.sy + 1); ctx.closePath(); ctx.fill();
    const fl2 = legAnim; const bl2 = -legAnim;
    Iso.drawBox(ctx, x + 0.05 + fl2 * dir, y + 0.03, 0, 0.07, 0.07, z, Iso.darken(col, 15), Iso.darken(col, 25), Iso.darken(col, 35));
    Iso.drawBox(ctx, x + 0.05 + bl2 * dir, y + 0.22, 0, 0.07, 0.07, z, Iso.darken(col, 15), Iso.darken(col, 25), Iso.darken(col, 35));
    Iso.drawBox(ctx, x + 0.35 + bl2 * dir, y + 0.03, 0, 0.07, 0.07, z, Iso.darken(col, 15), Iso.darken(col, 25), Iso.darken(col, 35));
    Iso.drawBox(ctx, x + 0.35 + fl2 * dir, y + 0.22, 0, 0.07, 0.07, z, Iso.darken(col, 15), Iso.darken(col, 25), Iso.darken(col, 35));
    const t1 = Iso.toScreen(x + (dir > 0 ? -0.05 : 0.5), y + 0.15, z + 0.15);
    const t2 = Iso.toScreen(x + (dir > 0 ? -0.25 : 0.7), y + 0.15 + tailSwish, z + 0.3);
    const t3 = Iso.toScreen(x + (dir > 0 ? -0.15 : 0.6), y + 0.15 - tailSwish * 0.5, z + 0.5);
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(t1.sx, t1.sy); ctx.quadraticCurveTo(t2.sx, t2.sy, t3.sx, t3.sy); ctx.stroke();
  },

  // ── FROG (redesigned - rounder, cuter) ─────────────────────────

  drawFrog(ctx, x, y, z, frame, dir, state) {
    dir = dir || 1; state = state || 'walking';
    const breathe = Math.sin(frame * 0.07) * 0.01;
    const col = '#66BB6A';
    const darkCol = '#43A047';
    const bellyCol = '#A5D6A7';

    if (state === 'sleeping' || state === 'laying') {
      const fz = 0.01;
      // Flat round body
      const bc = Iso.toScreen(x + 0.15, y + 0.12, fz + 0.06 + breathe);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(bc.sx, bc.sy, 14, 8, 0, 0, Math.PI * 2); ctx.fill();
      // Belly
      ctx.fillStyle = bellyCol;
      ctx.beginPath(); ctx.ellipse(bc.sx, bc.sy + 2, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
      // Head bump
      const hsx = dir > 0 ? bc.sx + 8 : bc.sx - 8;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(hsx, bc.sy - 2, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      // Eyes
      const eOff = dir > 0 ? 6 : -6;
      const eL = { sx: hsx + eOff - 2, sy: bc.sy - 7 };
      const eR = { sx: hsx + eOff + 4, sy: bc.sy - 7 };
      if (state === 'sleeping') {
        ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(eL.sx - 2, eL.sy); ctx.lineTo(eL.sx + 3, eL.sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(eR.sx - 2, eR.sy); ctx.lineTo(eR.sx + 3, eR.sy); ctx.stroke();
        this._drawZzz(ctx, { sx: hsx, sy: bc.sy - 18 }, frame);
      } else {
        ctx.fillStyle = '#FFF';
        ctx.beginPath(); ctx.arc(eL.sx, eL.sy, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eR.sx, eR.sy, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath(); ctx.arc(eL.sx + dir * 0.5, eL.sy, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eR.sx + dir * 0.5, eR.sy, 1.8, 0, Math.PI * 2); ctx.fill();
      }
      // Legs tucked
      ctx.fillStyle = darkCol;
      ctx.beginPath(); ctx.ellipse(bc.sx - 10, bc.sy + 3, 4, 3, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(bc.sx + 10, bc.sy + 3, 4, 3, 0.3, 0, Math.PI * 2); ctx.fill();
      return;
    }

    // Hopping animation for walking
    const hop = state === 'walking' ? Math.abs(Math.sin(frame * 0.1)) * 0.08 : 0;
    const playHop = state === 'playing' ? Math.abs(Math.sin(frame * 0.18)) * 0.2 : 0;
    const hopZ = z + hop + playHop;

    const bc = Iso.toScreen(x + 0.15, y + 0.12, hopZ + 0.1 + breathe);

    // Shadow
    const shadow = Iso.toScreen(x + 0.15, y + 0.12, 0.01);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath(); ctx.ellipse(shadow.sx, shadow.sy, 12, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Back legs (bigger, powerful)
    const legStretch = state === 'walking' ? Math.sin(frame * 0.1) * 3 : 0;
    ctx.fillStyle = darkCol;
    ctx.beginPath(); ctx.ellipse(bc.sx - 12 - legStretch, bc.sy + 5, 6, 4, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bc.sx + 4 - legStretch, bc.sy + 7, 6, 4, 0.4, 0, Math.PI * 2); ctx.fill();
    // Webbed feet
    ctx.fillStyle = '#388E3C';
    ctx.beginPath(); ctx.ellipse(bc.sx - 16 - legStretch, bc.sy + 6, 4, 2, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bc.sx + 8 - legStretch, bc.sy + 8, 4, 2, 0.3, 0, Math.PI * 2); ctx.fill();

    // Body (round)
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(bc.sx, bc.sy, 14, 9, 0, 0, Math.PI * 2); ctx.fill();

    // Belly
    ctx.fillStyle = bellyCol;
    ctx.beginPath(); ctx.ellipse(bc.sx + dir * 2, bc.sy + 2, 9, 5, 0, 0, Math.PI * 2); ctx.fill();

    // Spots
    ctx.fillStyle = darkCol;
    ctx.beginPath(); ctx.ellipse(bc.sx - 4, bc.sy - 4, 2.5, 2, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bc.sx + 5, bc.sy - 2, 2, 1.5, -0.2, 0, Math.PI * 2); ctx.fill();

    // Front legs
    const fLegStretch = state === 'walking' ? Math.sin(frame * 0.1 + Math.PI) * 2 : 0;
    ctx.fillStyle = darkCol;
    const frontX = dir > 0 ? bc.sx + 10 : bc.sx - 10;
    ctx.beginPath(); ctx.ellipse(frontX + fLegStretch, bc.sy + 4, 4, 3, dir * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(frontX + fLegStretch + dir * 2, bc.sy + 6, 4, 3, dir * 0.3, 0, Math.PI * 2); ctx.fill();

    // Head (wider, rounder)
    const headOff = dir > 0 ? 8 : -8;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(bc.sx + headOff, bc.sy - 3, 10, 7, 0, 0, Math.PI * 2); ctx.fill();

    // Big bulging eyes on top
    const eyeCx = bc.sx + headOff;
    const eyeY = bc.sy - 10;
    // Eye bumps
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(eyeCx - 5, eyeY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eyeCx + 5, eyeY, 5, 0, Math.PI * 2); ctx.fill();
    // White
    ctx.fillStyle = '#FFF';
    ctx.beginPath(); ctx.arc(eyeCx - 5, eyeY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eyeCx + 5, eyeY, 4, 0, Math.PI * 2); ctx.fill();
    // Pupils
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(eyeCx - 5 + dir, eyeY + 0.5, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eyeCx + 5 + dir, eyeY + 0.5, 2, 0, Math.PI * 2); ctx.fill();

    // Smile
    const smileX = bc.sx + headOff + dir * 5;
    ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(smileX, bc.sy - 1, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();
  },

});
