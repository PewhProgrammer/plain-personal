// ── Sprites: Environment (window, plants, seasonal) ─────────────

Object.assign(Sprites, {

  drawWindow(ctx, x, y, z, skyColors, shootingStar, birds, weather, frame) {
    skyColors = skyColors || { top: '#87CEEB', mid: '#B0E0FF', bot: '#E8F4FD' };
    Iso.drawBox(ctx, x, y, z, 2.5, 0.1, 2, '#8B7355', '#7A6348', '#6B553B');
    const { sx: gx1, sy: gy1 } = Iso.toScreen(x + 0.15, y - 0.02, z + 0.15);
    const { sx: gx2, sy: gy2 } = Iso.toScreen(x + 2.35, y - 0.02, z + 0.15);
    const { sx: gx3, sy: gy3 } = Iso.toScreen(x + 2.35, y - 0.02, z + 1.85);
    const { sx: gx4, sy: gy4 } = Iso.toScreen(x + 0.15, y - 0.02, z + 1.85);
    const grad = ctx.createLinearGradient(gx4, gy4, gx1, gy1);
    grad.addColorStop(0, skyColors.top);
    grad.addColorStop(0.6, skyColors.mid);
    grad.addColorStop(1, skyColors.bot);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(gx1, gy1); ctx.lineTo(gx2, gy2);
    ctx.lineTo(gx3, gy3); ctx.lineTo(gx4, gy4);
    ctx.closePath(); ctx.fill();
    // Stars at night (when sky is dark)
    if (skyColors.stars) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const stars = [[0.5, 1.6], [1.2, 1.7], [1.8, 1.5], [0.8, 1.3], [1.5, 1.4], [2.0, 1.7]];
      for (const [sx, sz] of stars) {
        const sp = Iso.toScreen(x + sx, y - 0.02, z + sz);
        ctx.beginPath(); ctx.arc(sp.sx, sp.sy, 1, 0, Math.PI * 2); ctx.fill();
      }
    }
    // Shooting star (night only)
    if (shootingStar && skyColors.stars) {
      const progress = shootingStar.life / shootingStar.maxLife;
      const alpha = progress < 0.3 ? progress / 0.3 : (1 - progress) / 0.7;
      for (let t = 0; t < 4; t++) {
        const trailX = shootingStar.x - shootingStar.dx * t * 0.5;
        const trailZ = shootingStar.z - shootingStar.dz * t * 0.5;
        if (trailX < 0.15 || trailX > 2.35 || trailZ < 0.15 || trailZ > 1.85) continue;
        const sp = Iso.toScreen(x + trailX, y - 0.02, z + trailZ);
        const trailAlpha = alpha * (1 - t * 0.25);
        const radius = 1.5 - t * 0.3;
        ctx.fillStyle = `rgba(255, 255, ${200 + t * 15}, ${trailAlpha * 0.9})`;
        ctx.beginPath(); ctx.arc(sp.sx, sp.sy, Math.max(0.5, radius), 0, Math.PI * 2); ctx.fill();
      }
    }
    // Birds (daytime only)
    if (birds && birds.length > 0 && !skyColors.stars) {
      for (const bird of birds) {
        const bx = x + bird.x;
        const bz = z + bird.z + (bird.approachY || 0) * 0.5;
        const bp = Iso.toScreen(bx, y - 0.02, bz);
        ctx.fillStyle = 'rgba(40, 30, 20, 0.8)';
        ctx.beginPath(); ctx.ellipse(bp.sx, bp.sy, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
        const wingAngle = bird.state !== 'sitting'
          ? Math.sin(bird.timer * 0.3 + bird.wingPhase) * 0.4 : 0;
        ctx.strokeStyle = 'rgba(40, 30, 20, 0.8)'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bp.sx - 4, bp.sy - 1 - wingAngle * 3);
        ctx.quadraticCurveTo(bp.sx - 2, bp.sy - 3, bp.sx, bp.sy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bp.sx + 4, bp.sy - 1 - wingAngle * 3);
        ctx.quadraticCurveTo(bp.sx + 2, bp.sy - 3, bp.sx, bp.sy);
        ctx.stroke();
      }
    }
    // Weather effects on window glass
    if (weather === 'rain' || weather === 'thunderstorm') {
      ctx.strokeStyle = 'rgba(120, 160, 220, 0.6)'; ctx.lineWidth = 1;
      for (let i = 0; i < 15; i++) {
        const seed = Math.sin(i * 45.17 + 23.31) * 0.5 + 0.5;
        const rx = 0.2 + seed * 2.0;
        const animOffset = ((frame || 0) * 0.03 + i * 0.13) % 1.7;
        const rz = 1.8 - animOffset;
        if (rz < 0.2 || rz > 1.8) continue;
        const rp1 = Iso.toScreen(x + rx, y - 0.015, z + rz);
        const rp2 = Iso.toScreen(x + rx, y - 0.015, z + rz - 0.08);
        ctx.beginPath(); ctx.moveTo(rp1.sx, rp1.sy); ctx.lineTo(rp2.sx, rp2.sy); ctx.stroke();
      }
    } else if (weather === 'snow') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 12; i++) {
        const seed = Math.sin(i * 67.89 + 12.45) * 0.5 + 0.5;
        const sx2 = 0.2 + seed * 2.0;
        const animOffset = ((frame || 0) * 0.012 + i * 0.15) % 1.7;
        const sway = Math.sin((frame || 0) * 0.02 + i * 1.3) * 0.1;
        const sz2 = 1.8 - animOffset;
        if (sz2 < 0.2 || sz2 > 1.8) continue;
        const sp2 = Iso.toScreen(x + sx2 + sway, y - 0.015, z + sz2);
        ctx.beginPath(); ctx.arc(sp2.sx, sp2.sy, 2, 0, Math.PI * 2); ctx.fill();
      }
    }

    ctx.strokeStyle = '#8B7355'; ctx.lineWidth = 2;
    const midTop = Iso.toScreen(x + 1.25, y - 0.02, z + 1.85);
    const midBot = Iso.toScreen(x + 1.25, y - 0.02, z + 0.15);
    ctx.beginPath(); ctx.moveTo(midTop.sx, midTop.sy); ctx.lineTo(midBot.sx, midBot.sy); ctx.stroke();
    const midL = Iso.toScreen(x + 0.15, y - 0.02, z + 1);
    const midR = Iso.toScreen(x + 2.35, y - 0.02, z + 1);
    ctx.beginPath(); ctx.moveTo(midL.sx, midL.sy); ctx.lineTo(midR.sx, midR.sy); ctx.stroke();
    this._drawCurtain(ctx, x - 0.1, y, z, 2.2, '#D4A574');
    this._drawCurtain(ctx, x + 2.3, y, z, 2.2, '#D4A574');
  },

  _drawCurtain(ctx, x, y, z, h, col1) {
    // Draw 3 overlapping folds for a draped look
    const folds = [
      { dx: 0, w: 0.22, botDrop: 0.15, alpha: 1.0, shade: 0 },
      { dx: 0.08, w: 0.2, botDrop: 0.25, alpha: 0.85, shade: -15 },
      { dx: 0.16, w: 0.22, botDrop: 0.1, alpha: 0.9, shade: 10 },
    ];
    for (const fold of folds) {
      const fx = x + fold.dx;
      const top = Iso.toScreen(fx, y - 0.05, z + h);
      const topR = Iso.toScreen(fx + fold.w, y - 0.05, z + h);
      const botR = Iso.toScreen(fx + fold.w, y - 0.05, z + 0.3 + fold.botDrop);
      const bot = Iso.toScreen(fx, y - 0.05, z + 0.3);
      ctx.globalAlpha = fold.alpha;
      ctx.fillStyle = fold.shade >= 0 ? Iso.lighten(col1, fold.shade) : Iso.darken(col1, -fold.shade);
      ctx.beginPath();
      ctx.moveTo(top.sx, top.sy); ctx.lineTo(topR.sx, topR.sy);
      ctx.lineTo(botR.sx, botR.sy); ctx.lineTo(bot.sx, bot.sy);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Curtain rod bracket
    const rod = Iso.toScreen(x + 0.1, y - 0.06, z + h + 0.05);
    ctx.fillStyle = '#8B7355';
    ctx.beginPath(); ctx.arc(rod.sx, rod.sy, 2.5, 0, Math.PI * 2); ctx.fill();
  },

  drawPlant(ctx, x, y, z, type, frame) {
    const sway = Math.sin(frame * 0.025 + x * 2) * 2;
    if (type === 0) {
      Iso.drawBox(ctx, x, y, z, 0.45, 0.45, 0.38, '#D4956A', '#C4855A', '#B4754A');
      Iso.drawBox(ctx, x - 0.02, y - 0.02, z + 0.32, 0.49, 0.49, 0.06, '#C4855A', '#B4754A', '#A4654A');
      Iso.drawBox(ctx, x + 0.02, y + 0.02, z + 0.15, 0.41, 0.41, 0.04, '#E8B88A', '#D4A57A', '#C4956A');
    } else if (type === 1) {
      Iso.drawBox(ctx, x, y, z, 0.42, 0.42, 0.4, '#F5F5F5', '#E8E8E8', '#DCDCDC');
      Iso.drawBox(ctx, x - 0.01, y - 0.01, z + 0.34, 0.44, 0.44, 0.06, '#EEEEEE', '#E0E0E0', '#D5D5D5');
    } else if (type === 2) {
      Iso.drawBox(ctx, x, y, z, 0.43, 0.43, 0.36, '#37474F', '#263238', '#1C2429');
      Iso.drawBox(ctx, x - 0.01, y - 0.01, z + 0.3, 0.45, 0.45, 0.06, '#455A64', '#37474F', '#263238');
    } else {
      Iso.drawBox(ctx, x, y, z, 0.4, 0.4, 0.35, '#7E57C2', '#673AB7', '#5E35B1');
      Iso.drawBox(ctx, x - 0.01, y - 0.01, z + 0.29, 0.42, 0.42, 0.06, '#9575CD', '#7E57C2', '#673AB7');
    }
    const soilZ = z + (type === 1 ? 0.36 : type === 0 ? 0.34 : type === 2 ? 0.32 : 0.31);
    Iso.drawBox(ctx, x + 0.04, y + 0.04, soilZ, 0.36, 0.36, 0.03, '#5D4037', '#4E342E', '#3E2723');
    const center = Iso.toScreen(x + 0.22, y + 0.22, soilZ + 0.25);
    if (type === 0) {
      const stems = [
        { angle: -0.4, len: 28, leafSize: 12 }, { angle: 0.3, len: 32, leafSize: 14 },
        { angle: 1.0, len: 26, leafSize: 11 }, { angle: 1.8, len: 30, leafSize: 13 },
        { angle: 2.5, len: 24, leafSize: 10 }, { angle: 3.2, len: 28, leafSize: 12 },
        { angle: 4.0, len: 22, leafSize: 11 }, { angle: 4.8, len: 30, leafSize: 13 },
        { angle: 5.5, len: 26, leafSize: 12 },
      ];
      for (const stem of stems) {
        const a = stem.angle + sway * 0.01;
        const tipX = center.sx + Math.cos(a) * stem.len;
        const tipY = center.sy + Math.sin(a) * stem.len * 0.45 - 12;
        ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(center.sx, center.sy);
        ctx.quadraticCurveTo((center.sx + tipX) / 2, (center.sy + tipY) / 2 - 5, tipX, tipY); ctx.stroke();
        ctx.fillStyle = stem.len > 28 ? '#43A047' : '#66BB6A';
        ctx.beginPath(); ctx.ellipse(tipX, tipY - 2, stem.leafSize, stem.leafSize * 0.55, a * 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(46, 125, 50, 0.4)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(tipX - Math.cos(a) * stem.leafSize * 0.7, tipY - 2);
        ctx.lineTo(tipX + Math.cos(a) * stem.leafSize * 0.7, tipY - 2); ctx.stroke();
      }
      const flowerColors = ['#FF4081', '#FF80AB', '#F48FB1'];
      for (let i = 0; i < 3; i++) {
        const fa = i * 2.1 + 0.5;
        const fx = center.sx + Math.cos(fa) * 15;
        const fy = center.sy + Math.sin(fa) * 8 - 18;
        ctx.fillStyle = flowerColors[i];
        for (let p = 0; p < 5; p++) {
          const pa = (p / 5) * Math.PI * 2;
          ctx.beginPath(); ctx.arc(fx + Math.cos(pa) * 3, fy + Math.sin(pa) * 2, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath(); ctx.arc(fx, fy, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    } else if (type === 1) {
      const leafPositions = [
        { a: 0, r: 14 }, { a: 0.7, r: 18 }, { a: 1.4, r: 16 }, { a: 2.1, r: 20 },
        { a: 2.8, r: 14 }, { a: 3.5, r: 18 }, { a: 4.2, r: 16 }, { a: 4.9, r: 19 }, { a: 5.6, r: 15 },
      ];
      for (const lp of leafPositions) {
        const a = lp.a + sway * 0.008;
        const lx = center.sx + Math.cos(a) * lp.r;
        const ly = center.sy + Math.sin(a) * lp.r * 0.45 - 10;
        ctx.fillStyle = lp.r > 17 ? '#388E3C' : '#43A047';
        ctx.beginPath(); ctx.ellipse(lx, ly, 7, 4.5, a * 0.4, 0, Math.PI * 2); ctx.fill();
      }
      const flowers = [
        { a: 0.3, r: 10, col: '#E91E63', size: 5 }, { a: 1.2, r: 16, col: '#FF5252', size: 6 },
        { a: 2.0, r: 8, col: '#F06292', size: 4.5 }, { a: 2.8, r: 14, col: '#E91E63', size: 5.5 },
        { a: 3.8, r: 12, col: '#FF80AB', size: 4 }, { a: 4.5, r: 16, col: '#FF5252', size: 5 },
        { a: 5.3, r: 10, col: '#F06292', size: 5 },
      ];
      for (const f of flowers) {
        const a = f.a + sway * 0.005;
        const fx = center.sx + Math.cos(a) * f.r;
        const fy = center.sy + Math.sin(a) * f.r * 0.4 - 16;
        ctx.fillStyle = f.col;
        for (let p = 0; p < 6; p++) {
          const pa = (p / 6) * Math.PI * 2;
          ctx.beginPath(); ctx.ellipse(fx + Math.cos(pa) * f.size * 0.5, fy + Math.sin(pa) * f.size * 0.3, f.size * 0.4, f.size * 0.25, pa, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#FFF176';
        ctx.beginPath(); ctx.arc(fx, fy, f.size * 0.2, 0, Math.PI * 2); ctx.fill();
      }
    } else if (type === 2) {
      const vines = [{ a: 0.5, len: 28 }, { a: 1.5, len: 22 }, { a: 2.5, len: 32 }, { a: 3.5, len: 26 }, { a: 4.5, len: 30 }, { a: 5.5, len: 24 }];
      for (const vine of vines) {
        const a = vine.a + sway * 0.008;
        const sx = center.sx + Math.cos(a) * 5;
        const sy = center.sy + Math.sin(a) * 3;
        const ex = sx + Math.cos(a) * vine.len;
        const ey = sy + vine.len * 0.7;
        const mx = (sx + ex) / 2 + Math.cos(a) * vine.len * 0.4;
        const my = (sy + ey) / 2;
        ctx.strokeStyle = '#66BB6A'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
        for (let i = 0; i < 4; i++) {
          const t = (i + 1) / 5;
          const px = sx + (mx - sx) * t * 2 * (1 - t) + (ex - sx) * t * t;
          const py = sy + (my - sy) * t * 2 * (1 - t) + (ey - sy) * t * t;
          ctx.fillStyle = i % 2 === 0 ? '#4CAF50' : '#81C784';
          ctx.beginPath(); ctx.ellipse(px + 3, py - 1, 4, 2.5, a * 0.3, 0, Math.PI * 2); ctx.fill();
        }
        if (vine.len > 26) {
          ctx.fillStyle = '#CE93D8';
          for (let p = 0; p < 4; p++) {
            const pa = (p / 4) * Math.PI * 2;
            ctx.beginPath(); ctx.arc(ex + Math.cos(pa) * 2.5, ey + Math.sin(pa) * 1.5, 1.5, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = '#FFD54F';
          ctx.beginPath(); ctx.arc(ex, ey, 1, 0, Math.PI * 2); ctx.fill();
        }
      }
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.fillStyle = i % 2 === 0 ? '#43A047' : '#66BB6A';
        ctx.beginPath(); ctx.ellipse(center.sx + Math.cos(a) * 6, center.sy + Math.sin(a) * 3 - 5, 5, 3.5, a, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath(); ctx.ellipse(center.sx + Math.cos(a) * 8, center.sy + Math.sin(a) * 4 + 3, 10, 3, a * 0.3, 0, Math.PI * 2); ctx.fill();
      }
      const stemTop = { sx: center.sx + sway, sy: center.sy - 35 };
      ctx.strokeStyle = '#558B2F'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(center.sx, center.sy - 3);
      ctx.quadraticCurveTo(center.sx + sway * 0.5, center.sy - 18, stemTop.sx, stemTop.sy); ctx.stroke();
      const orchidColors = ['#E040FB', '#EA80FC', '#CE93D8', '#AB47BC', '#BA68C8'];
      for (let i = 0; i < 5; i++) {
        const t = 0.3 + i * 0.15;
        const fx = center.sx + (stemTop.sx - center.sx) * t + Math.sin(i) * 4;
        const fy = center.sy - 3 + (stemTop.sy - center.sy + 3) * t;
        const fSize = 5 - i * 0.3;
        ctx.fillStyle = orchidColors[i];
        for (let p = 0; p < 5; p++) {
          const pa = (p / 5) * Math.PI * 2 - 0.3;
          ctx.beginPath(); ctx.ellipse(fx + Math.cos(pa) * fSize, fy + Math.sin(pa) * fSize * 0.6, fSize * 0.55, fSize * 0.35, pa * 0.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#FFF176';
        ctx.beginPath(); ctx.arc(fx, fy, fSize * 0.25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = Iso.darken(orchidColors[i], 30);
        ctx.beginPath(); ctx.ellipse(fx, fy + fSize * 0.3, fSize * 0.3, fSize * 0.15, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
  },

  drawChristmasTree(ctx, x, y, z, frame) {
    // Trunk
    Iso.drawBox(ctx, x + 0.3, y + 0.3, z, 0.3, 0.3, 0.4, '#5D4037', '#4E342E', '#3E2723');
    // 3 green cone tiers (boxes that get smaller)
    Iso.drawBox(ctx, x, y, z + 0.4, 0.9, 0.9, 0.5, '#2E7D32', '#1B5E20', '#145214');
    Iso.drawBox(ctx, x + 0.1, y + 0.1, z + 0.8, 0.7, 0.7, 0.45, '#388E3C', '#2E7D32', '#1B5E20');
    Iso.drawBox(ctx, x + 0.2, y + 0.2, z + 1.15, 0.5, 0.5, 0.4, '#43A047', '#388E3C', '#2E7D32');
    // Star on top
    const star = Iso.toScreen(x + 0.45, y + 0.45, z + 1.6);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u2B50', star.sx, star.sy);
    ctx.textAlign = 'left';
    // Ornaments (colored dots)
    const ornColors = ['#F44336', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
    const ornPositions = [
      [0.15, 0.5, 0.55], [0.6, 0.2, 0.65], [0.35, 0.8, 0.5],
      [0.5, 0.4, 0.95], [0.25, 0.3, 1.2],
    ];
    for (let i = 0; i < ornPositions.length; i++) {
      const op = Iso.toScreen(x + ornPositions[i][0], y + ornPositions[i][1], z + ornPositions[i][2]);
      const pulse = 1 + Math.sin(frame * 0.05 + i) * 0.2;
      ctx.fillStyle = ornColors[i];
      ctx.beginPath(); ctx.arc(op.sx, op.sy, 3 * pulse, 0, Math.PI * 2); ctx.fill();
    }
  },

  drawPumpkins(ctx, x, y, z) {
    // Pumpkin 1 (big)
    const p1 = Iso.toScreen(x + 0.3, y + 0.4, z + 0.2);
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath(); ctx.ellipse(p1.sx, p1.sy, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
    // Stem
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(p1.sx - 2, p1.sy - 14, 4, 6);
    // Face
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.moveTo(p1.sx - 6, p1.sy - 3); ctx.lineTo(p1.sx - 3, p1.sy - 6); ctx.lineTo(p1.sx, p1.sy - 3); ctx.fill(); // left eye
    ctx.beginPath(); ctx.moveTo(p1.sx + 2, p1.sy - 3); ctx.lineTo(p1.sx + 5, p1.sy - 6); ctx.lineTo(p1.sx + 8, p1.sy - 3); ctx.fill(); // right eye
    ctx.beginPath(); ctx.arc(p1.sx + 1, p1.sy + 2, 5, 0, Math.PI); ctx.fill(); // mouth

    // Pumpkin 2 (small)
    const p2 = Iso.toScreen(x + 0.7, y + 0.6, z + 0.15);
    ctx.fillStyle = '#E65100';
    ctx.beginPath(); ctx.ellipse(p2.sx, p2.sy, 9, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(p2.sx - 1.5, p2.sy - 10, 3, 5);
  },

  drawCherryBlossomPetals(ctx, frame) {
    ctx.fillStyle = 'rgba(255, 183, 197, 0.5)';
    for (let i = 0; i < 8; i++) {
      const phase = (frame * 0.008 + i * 0.75) % 6;
      const px = -100 + phase * 200;
      const py = 50 + Math.sin(frame * 0.015 + i * 2) * 40 + i * 30;
      const rot = frame * 0.02 + i;
      ctx.beginPath();
      ctx.ellipse(px, py, 4, 2.5, rot, 0, Math.PI * 2);
      ctx.fill();
    }
  },

});
