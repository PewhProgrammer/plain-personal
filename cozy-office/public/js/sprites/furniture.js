// ── Sprites: Furniture (desks, chair, bed, shelves, etc.) ───────

Object.assign(Sprites, {

  drawFloor(ctx, camX, camY, roomW, roomD) {
    for (let x = 0; x < roomW; x++) {
      for (let y = 0; y < roomD; y++) {
        const { sx, sy } = Iso.toScreen(x, y, 0);
        const isLight = (x + y) % 2 === 0;
        const color = isLight ? '#C4956A' : '#B8895E';
        Iso.drawFloorTile(ctx, sx + camX, sy + camY, color);
      }
    }
  },

  drawWalls(ctx, camX, camY, roomW, roomD, wallH) {
    for (let x = 0; x < roomW; x++) {
      Iso.drawBox(ctx, x, 0, 0, 1, 0.08, wallH, '#F5E6D3', '#E8D5C0', '#DBC8B3');
    }
    for (let y = 0; y < roomD; y++) {
      Iso.drawBox(ctx, 0, y, 0, 0.08, 1, wallH, '#F5E6D3', '#E8D5C0', '#DBC8B3');
    }
  },

  _drawRGBStrip(ctx, x, y, z, w, h, hue) {
    const color = `hsl(${hue}, 80%, 55%)`;
    const darkColor = `hsl(${hue}, 80%, 40%)`;
    const darkerColor = `hsl(${hue}, 80%, 30%)`;
    Iso.drawBox(ctx, x, y, z, w, 0.04, h, color, darkColor, darkerColor);
    const p1 = Iso.toScreen(x, y - 0.01, z);
    const p2 = Iso.toScreen(x + w, y - 0.01, z);
    const p3 = Iso.toScreen(x + w, y - 0.01, z + h);
    const p4 = Iso.toScreen(x, y - 0.01, z + h);
    ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.18)`;
    ctx.beginPath();
    ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy);
    ctx.lineTo(p3.sx, p3.sy); ctx.lineTo(p4.sx, p4.sy);
    ctx.closePath(); ctx.fill();
  },

  _drawMonitor(ctx, x, y, z, frameCol, w, frame, on) {
    if (on === undefined) on = true;
    const h = 0.7;
    Iso.drawBox(ctx, x + w/2 - 0.1, y + 0.1, z, 0.2, 0.15, 0.3, '#444', '#333', '#222');
    Iso.drawBox(ctx, x + w/2 - 0.25, y + 0.05, z, 0.5, 0.25, 0.04, '#444', '#333', '#222');
    Iso.drawBox(ctx, x, y, z + 0.3, w, 0.08, h, frameCol, Iso.darken(frameCol, 10), Iso.darken(frameCol, 20));
    const s1 = Iso.toScreen(x + 0.05, y - 0.01, z + 0.35);
    const s2 = Iso.toScreen(x + w - 0.05, y - 0.01, z + 0.35);
    const s3 = Iso.toScreen(x + w - 0.05, y - 0.01, z + 0.3 + h - 0.05);
    const s4 = Iso.toScreen(x + 0.05, y - 0.01, z + 0.3 + h - 0.05);
    if (!on) {
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath();
      ctx.moveTo(s1.sx, s1.sy); ctx.lineTo(s2.sx, s2.sy);
      ctx.lineTo(s3.sx, s3.sy); ctx.lineTo(s4.sx, s4.sy);
      ctx.closePath(); ctx.fill();
      const led = Iso.toScreen(x + w/2, y - 0.01, z + 0.36);
      ctx.fillStyle = '#FF8C00';
      ctx.beginPath(); ctx.arc(led.sx, led.sy, 1.5, 0, Math.PI * 2); ctx.fill();
      return;
    }
    const sGrad = ctx.createLinearGradient(s4.sx, s4.sy, s1.sx, s1.sy);
    sGrad.addColorStop(0, '#1e3a5f');
    sGrad.addColorStop(0.5, '#2a4a6f');
    sGrad.addColorStop(1, '#1e3a5f');
    ctx.fillStyle = sGrad;
    ctx.beginPath();
    ctx.moveTo(s1.sx, s1.sy); ctx.lineTo(s2.sx, s2.sy);
    ctx.lineTo(s3.sx, s3.sy); ctx.lineTo(s4.sx, s4.sy);
    ctx.closePath(); ctx.fill();
    frame = frame || 0;
    const scrollSpeed = 0.002;
    const scrollOffset = (frame * scrollSpeed) % 1;
    const numLines = 8;
    ctx.lineWidth = 1;
    for (let i = 0; i < numLines; i++) {
      const lineT = ((i / numLines) + scrollOffset) % 1;
      const lz = z + 0.36 + lineT * (h - 0.12);
      const seed = Math.sin(i * 12.9898 + 78.233) * 0.5 + 0.5;
      const indent = seed > 0.7 ? 0.12 : (seed > 0.4 ? 0.06 : 0);
      const lineW = 0.12 + seed * (w * 0.45);
      const fade = lineT < 0.1 ? lineT * 10 : (lineT > 0.85 ? (1 - lineT) / 0.15 : 1);
      ctx.strokeStyle = `rgba(100, 200, 255, ${fade * 0.4})`;
      const l1 = Iso.toScreen(x + 0.08 + indent, y - 0.01, lz);
      const l2 = Iso.toScreen(x + 0.08 + indent + lineW, y - 0.01, lz);
      ctx.beginPath(); ctx.moveTo(l1.sx, l1.sy); ctx.lineTo(l2.sx, l2.sy); ctx.stroke();
    }
  },

  _drawMug(ctx, x, y, z) {
    Iso.drawBox(ctx, x, y, z, 0.2, 0.2, 0.25, '#F5F5F5', '#E0E0E0', '#CCCCCC');
    Iso.drawBox(ctx, x + 0.02, y + 0.02, z + 0.2, 0.16, 0.16, 0.02, '#4E342E', '#3E2723', '#3E2723');
  },

  _drawTeapot(ctx, x, y, z) {
    Iso.drawBox(ctx, x, y, z, 0.28, 0.22, 0.2, '#F5F5F5', '#E0E0E0', '#CCCCCC');
    Iso.drawBox(ctx, x + 0.04, y + 0.03, z + 0.2, 0.2, 0.16, 0.03, '#E8E8E8', '#D8D8D8', '#C8C8C8');
    Iso.drawBox(ctx, x + 0.1, y + 0.08, z + 0.23, 0.08, 0.06, 0.04, '#D0D0D0', '#C0C0C0', '#B0B0B0');
    const sp1 = Iso.toScreen(x + 0.28, y + 0.1, z + 0.14);
    const sp2 = Iso.toScreen(x + 0.38, y + 0.08, z + 0.2);
    ctx.strokeStyle = '#E0E0E0'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sp1.sx, sp1.sy); ctx.lineTo(sp2.sx, sp2.sy); ctx.stroke();
    const h1 = Iso.toScreen(x - 0.01, y + 0.11, z + 0.17);
    const h2 = Iso.toScreen(x - 0.07, y + 0.11, z + 0.1);
    const h3 = Iso.toScreen(x - 0.01, y + 0.11, z + 0.04);
    ctx.strokeStyle = '#D8D8D8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(h1.sx, h1.sy);
    ctx.quadraticCurveTo(h2.sx, h2.sy, h3.sx, h3.sy); ctx.stroke();
  },

  _drawWhiteChocolate(ctx, x, y, z) {
    Iso.drawBox(ctx, x, y, z, 0.5, 0.25, 0.02, '#DAA520', '#C4941A', '#AE8414');
    Iso.drawBox(ctx, x + 0.03, y + 0.03, z + 0.02, 0.44, 0.19, 0.06, '#FFF8E7', '#F5ECD5', '#EBE0C5');
    ctx.strokeStyle = 'rgba(200, 185, 155, 0.6)'; ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
      const l1 = Iso.toScreen(x + 0.03 + i * 0.11, y + 0.03, z + 0.081);
      const l2 = Iso.toScreen(x + 0.03 + i * 0.11, y + 0.22, z + 0.081);
      ctx.beginPath(); ctx.moveTo(l1.sx, l1.sy); ctx.lineTo(l2.sx, l2.sy); ctx.stroke();
    }
    const m1 = Iso.toScreen(x + 0.03, y + 0.12, z + 0.081);
    const m2 = Iso.toScreen(x + 0.47, y + 0.12, z + 0.081);
    ctx.beginPath(); ctx.moveTo(m1.sx, m1.sy); ctx.lineTo(m2.sx, m2.sy); ctx.stroke();
  },

  _drawSmallPlant(ctx, x, y, z, growthLevel) {
    growthLevel = (growthLevel !== undefined) ? growthLevel : 4;
    Iso.drawBox(ctx, x, y, z, 0.25, 0.25, 0.18, '#F8BBD0', '#F48FB1', '#EC407A');
    Iso.drawBox(ctx, x + 0.02, y + 0.02, z + 0.16, 0.21, 0.21, 0.02, '#5D4037', '#4E342E', '#3E2723');
    const c = Iso.toScreen(x + 0.12, y + 0.12, z + 0.28);
    const leafColors = ['#43A047', '#66BB6A', '#2E7D32', '#4CAF50', '#388E3C'];
    if (growthLevel === 0) {
      ctx.strokeStyle = '#43A047'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(c.sx, c.sy + 3); ctx.lineTo(c.sx, c.sy - 2); ctx.stroke();
      ctx.fillStyle = '#66BB6A';
      ctx.beginPath(); ctx.ellipse(c.sx - 3, c.sy - 3, 3, 1.5, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(c.sx + 3, c.sy - 3, 3, 1.5, 0.4, 0, Math.PI * 2); ctx.fill();
    } else if (growthLevel === 1) {
      ctx.strokeStyle = '#388E3C'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(c.sx, c.sy + 3); ctx.lineTo(c.sx, c.sy - 6); ctx.stroke();
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + 0.3;
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.beginPath();
        ctx.ellipse(c.sx + Math.cos(angle) * 4, c.sy + Math.sin(angle) * 2 - 4, 3, 1.8, angle * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (growthLevel === 2) {
      ctx.strokeStyle = '#388E3C'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(c.sx, c.sy + 3); ctx.lineTo(c.sx, c.sy - 5); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const r = 4 + Math.sin(i * 1.5) * 1;
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.beginPath();
        ctx.ellipse(c.sx + Math.cos(angle) * r, c.sy + Math.sin(angle) * r * 0.5 - 3, 3.5, 2, angle * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (growthLevel === 3) {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 5 + Math.sin(i * 1.7) * 2;
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.beginPath();
        ctx.ellipse(c.sx + Math.cos(angle) * r, c.sy + Math.sin(angle) * r * 0.5 - 3, 4.5, 2.5, angle * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 5 + Math.sin(i * 1.7) * 2;
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.beginPath();
        ctx.ellipse(c.sx + Math.cos(angle) * r, c.sy + Math.sin(angle) * r * 0.5 - 3, 4.5, 2.5, angle * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      const fc = { sx: c.sx + 2, sy: c.sy - 8 };
      ctx.fillStyle = '#FF80AB';
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(fc.sx + Math.cos(a) * 3, fc.sy + Math.sin(a) * 2, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#FFD54F';
      ctx.beginPath(); ctx.arc(fc.sx, fc.sy, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  },

  drawBoyDesk(ctx, x, y, z, frame, schedule, videoCall) {
    const on = schedule === 'work';
    const deskCol = '#5C4033';
    Iso.drawBox(ctx, x, y, z, 3.5, 1.5, 0.08, '#6B4C3B', Iso.darken(deskCol, 10), Iso.darken(deskCol, 25));
    const legCol = '#4A3228';
    Iso.drawBox(ctx, x + 0.1, y + 0.1, 0, 0.15, 0.15, z, legCol, Iso.darken(legCol, 10), Iso.darken(legCol, 20));
    Iso.drawBox(ctx, x + 3.2, y + 0.1, 0, 0.15, 0.15, z, legCol, Iso.darken(legCol, 10), Iso.darken(legCol, 20));
    Iso.drawBox(ctx, x + 0.1, y + 1.2, 0, 0.15, 0.15, z, legCol, Iso.darken(legCol, 10), Iso.darken(legCol, 20));
    Iso.drawBox(ctx, x + 3.2, y + 1.2, 0, 0.15, 0.15, z, legCol, Iso.darken(legCol, 10), Iso.darken(legCol, 20));
    if (on) {
      this._drawRGBStrip(ctx, x + 0.3, 0.08, z + 0.15, 0.9, 0.85, 270);
      this._drawRGBStrip(ctx, x + 1.3, 0.08, z + 0.15, 0.9, 0.85, 210);
      this._drawRGBStrip(ctx, x + 2.3, 0.08, z + 0.15, 0.9, 0.85, 170);
    }
    this._drawMonitor(ctx, x + 0.3, y + 0.15, z + 0.08, '#2D2D2D', 0.9, frame, on);
    this._drawMonitor(ctx, x + 1.3, y + 0.15, z + 0.08, '#2D2D2D', 0.9, frame, on);
    this._drawMonitor(ctx, x + 2.3, y + 0.15, z + 0.08, '#2D2D2D', 0.9, frame, on);
    if (videoCall && on) {
      const vs1 = Iso.toScreen(x + 1.35, y - 0.01, z + 0.43);
      const vs2 = Iso.toScreen(x + 2.15, y - 0.01, z + 0.43);
      const vs3 = Iso.toScreen(x + 2.15, y - 0.01, z + 0.93);
      const vs4 = Iso.toScreen(x + 1.35, y - 0.01, z + 0.93);
      ctx.fillStyle = 'rgba(0, 100, 0, 0.3)';
      ctx.beginPath(); ctx.moveTo(vs1.sx, vs1.sy); ctx.lineTo(vs2.sx, vs2.sy);
      ctx.lineTo(vs3.sx, vs3.sy); ctx.lineTo(vs4.sx, vs4.sy); ctx.closePath(); ctx.fill();
      const fc = Iso.toScreen(x + 1.75, y - 0.01, z + 0.7);
      ctx.fillStyle = 'rgba(253, 188, 180, 0.7)';
      ctx.beginPath(); ctx.arc(fc.sx, fc.sy, 8, 0, Math.PI * 2); ctx.fill();
      const lp = Iso.toScreen(x + 2.05, y - 0.01, z + 0.9);
      ctx.fillStyle = '#FF0000';
      ctx.beginPath(); ctx.arc(lp.sx, lp.sy, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    Iso.drawBox(ctx, x + 1.0, y + 0.8, z + 0.08, 1.2, 0.4, 0.03, '#3D3D3D', '#2D2D2D', '#1D1D1D');
    Iso.drawBox(ctx, x + 2.4, y + 0.9, z + 0.08, 0.2, 0.3, 0.04, '#3D3D3D', '#2D2D2D', '#1D1D1D');
    this._drawWhiteChocolate(ctx, x + 0.2, y + 0.9, z + 0.08);
    this._drawMug(ctx, x + 0.3, y + 1.15, z + 0.08);
  },

  drawGirlDesk(ctx, x, y, z, frame, schedule, videoCall, plantGrowth) {
    const on = schedule === 'work';
    const legCol = '#E8E8E8';
    Iso.drawBox(ctx, x + 0.1, y + 0.1, 0, 0.12, 0.12, z, legCol, '#D8D8D8', '#C8C8C8');
    Iso.drawBox(ctx, x + 2.2, y + 0.1, 0, 0.12, 0.12, z, legCol, '#D8D8D8', '#C8C8C8');
    Iso.drawBox(ctx, x + 0.1, y + 1.0, 0, 0.12, 0.12, z, legCol, '#D8D8D8', '#C8C8C8');
    Iso.drawBox(ctx, x + 2.2, y + 1.0, 0, 0.12, 0.12, z, legCol, '#D8D8D8', '#C8C8C8');
    Iso.drawBox(ctx, x, y, z, 2.5, 1.2, 0.06, '#FFFFFF', '#F0F0F0', '#E8E8E8');
    this._drawMonitor(ctx, x + 0.7, y + 0.1, z + 0.06, '#E0E0E0', 1.0, frame, on);
    if (videoCall && on) {
      const vs1 = Iso.toScreen(x + 0.75, y - 0.01, z + 0.17);
      const vs2 = Iso.toScreen(x + 1.65, y - 0.01, z + 0.17);
      const vs3 = Iso.toScreen(x + 1.65, y - 0.01, z + 0.71);
      const vs4 = Iso.toScreen(x + 0.75, y - 0.01, z + 0.71);
      ctx.fillStyle = 'rgba(0, 100, 0, 0.3)';
      ctx.beginPath(); ctx.moveTo(vs1.sx, vs1.sy); ctx.lineTo(vs2.sx, vs2.sy);
      ctx.lineTo(vs3.sx, vs3.sy); ctx.lineTo(vs4.sx, vs4.sy); ctx.closePath(); ctx.fill();
      const fc = Iso.toScreen(x + 1.2, y - 0.01, z + 0.45);
      ctx.fillStyle = 'rgba(253, 188, 180, 0.7)';
      ctx.beginPath(); ctx.arc(fc.sx, fc.sy, 8, 0, Math.PI * 2); ctx.fill();
      const lp = Iso.toScreen(x + 1.55, y - 0.01, z + 0.65);
      ctx.fillStyle = '#FF0000';
      ctx.beginPath(); ctx.arc(lp.sx, lp.sy, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    this._drawSmallPlant(ctx, x + 2.0, y + 0.3, z + 0.06, plantGrowth);
    Iso.drawBox(ctx, x + 0.2, y + 0.6, z + 0.06, 0.6, 0.4, 0.02, '#FFC0CB', '#FFB0C0', '#FFA0B0');
    Iso.drawBox(ctx, x + 2.1, y + 0.8, z + 0.06, 0.15, 0.15, 0.2, '#FFD700', '#E6C200', '#CCB000');
    this._drawTeapot(ctx, x + 1.6, y + 0.7, z + 0.06);
    this._drawMug(ctx, x + 1.9, y + 0.85, z + 0.06);
  },

  drawChair(ctx, x, y, z) {
    const wheelCol = '#333';
    Iso.drawBox(ctx, x + 0.1, y + 0.3, 0, 0.5, 0.08, 0.05, wheelCol, '#222', '#111');
    Iso.drawBox(ctx, x + 0.2, y + 0.1, 0, 0.08, 0.5, 0.05, wheelCol, '#222', '#111');
    Iso.drawBox(ctx, x + 0.27, y + 0.27, 0.05, 0.12, 0.12, 0.7, '#555', '#444', '#333');
    Iso.drawBox(ctx, x, y, 0.75, 0.7, 0.7, 0.12, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.05, y + 0.62, 0.87, 0.6, 0.08, 0.7, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x, y + 0.05, 0.87, 0.08, 0.55, 0.04, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.62, y + 0.05, 0.87, 0.08, 0.55, 0.04, '#2C3E50', '#1F2D3D', '#172230');
  },

  drawBookshelf(ctx, x, y, z) {
    const col = '#6B4226';
    Iso.drawBox(ctx, x, y, z, 2, 0.08, 3, '#5C3A20', Iso.darken(col, 15), Iso.darken(col, 25));
    Iso.drawBox(ctx, x, y, z, 0.06, 0.5, 3, '#7A4E30', col, Iso.darken(col, 15));
    Iso.drawBox(ctx, x + 1.94, y, z, 0.06, 0.5, 3, '#7A4E30', col, Iso.darken(col, 15));
    Iso.drawBox(ctx, x, y, z + 2.95, 2, 0.5, 0.05, '#8B6914', col, Iso.darken(col, 10));
    for (let s = 0; s < 4; s++) {
      const sz = z + 0.05 + s * 0.73;
      Iso.drawBox(ctx, x + 0.06, y + 0.08, sz, 1.88, 0.42, 0.04, '#A07840', '#8B6914', '#7A5C10');
    }
    const shelfBooks = [
      [
        { w: 0.14, h: 0.58, col: '#C0392B' }, { w: 0.12, h: 0.55, col: '#2980B9' },
        { w: 0.16, h: 0.62, col: '#27AE60' }, { w: 0.10, h: 0.50, col: '#8E44AD' },
        { w: 0.13, h: 0.60, col: '#E67E22' }, { w: 0.15, h: 0.56, col: '#1ABC9C' },
        { w: 0.11, h: 0.48, col: '#F39C12' }, { w: 0.14, h: 0.54, col: '#E74C3C' },
        { w: 0.12, h: 0.58, col: '#3498DB' }, { w: 0.13, h: 0.52, col: '#9B59B6' },
      ],
      [
        { w: 0.13, h: 0.55, col: '#D35400' }, { w: 0.15, h: 0.60, col: '#2C3E50' },
        { w: 0.11, h: 0.45, col: '#16A085' }, { w: 0.14, h: 0.58, col: '#C0392B' },
        { w: 0.12, h: 0.50, col: '#7D3C98' },
        { w: 0.40, h: 0.08, col: '#2471A3', horiz: true, stack: 0 },
        { w: 0.38, h: 0.07, col: '#A93226', horiz: true, stack: 1 },
        { w: 0.42, h: 0.08, col: '#1E8449', horiz: true, stack: 2 },
        { w: 0.12, h: 0.52, col: '#AF601A' },
      ],
      [
        { w: 0.16, h: 0.62, col: '#922B21' }, { w: 0.11, h: 0.50, col: '#1A5276' },
        { w: 0.13, h: 0.56, col: '#196F3D' }, { w: 0.14, h: 0.60, col: '#7B241C' },
        { w: 0.10, h: 0.48, col: '#6C3483' }, { w: 0.15, h: 0.58, col: '#CA6F1E' },
        { w: 0.12, h: 0.54, col: '#117864' }, { w: 0.13, h: 0.52, col: '#A04000' },
        { w: 0.11, h: 0.50, col: '#1F618D' }, { w: 0.14, h: 0.56, col: '#884EA0' },
      ],
      [
        { w: 0.14, h: 0.55, col: '#B03A2E' }, { w: 0.12, h: 0.50, col: '#2E86C1' },
        { w: 0.15, h: 0.60, col: '#229954' }, { w: 0.13, h: 0.48, col: '#D4AC0D' },
        { w: 0.11, h: 0.52, col: '#7D3C98' }, { w: 0.14, h: 0.56, col: '#E74C3C' },
        { w: 0.12, h: 0.54, col: '#148F77' },
      ],
    ];
    for (let s = 0; s < 4; s++) {
      const sz = z + 0.09 + s * 0.73;
      const books = shelfBooks[s];
      let bx = x + 0.12;
      for (const book of books) {
        if (book.horiz) {
          const stackZ = sz + book.stack * (book.h + 0.01);
          Iso.drawBox(ctx, bx, y + 0.1, stackZ, book.w, 0.32, book.h,
            Iso.lighten(book.col, 25), book.col, Iso.darken(book.col, 25));
          if (book.stack === 2 || (!books.find(b => b.stack === book.stack + 1))) {
            Iso.drawBox(ctx, bx + 0.02, y + 0.12, stackZ + book.h, book.w - 0.04, 0.28, 0.005,
              '#F5F0E0', '#E8E0D0', '#DDD5C5');
          }
          if (book.stack === 0) bx += book.w + 0.03;
        } else {
          const depth = 0.32;
          Iso.drawBox(ctx, bx, y + 0.1, sz, book.w, depth, book.h,
            Iso.lighten(book.col, 15), book.col, Iso.darken(book.col, 30));
          const spineBot = Iso.toScreen(bx + book.w / 2, y + 0.1 + depth + 0.01, sz + book.h * 0.3);
          const spineTop = Iso.toScreen(bx + book.w / 2, y + 0.1 + depth + 0.01, sz + book.h * 0.7);
          ctx.strokeStyle = Iso.lighten(book.col, 50);
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(spineBot.sx, spineBot.sy); ctx.lineTo(spineTop.sx, spineTop.sy); ctx.stroke();
          Iso.drawBox(ctx, bx + 0.01, y + 0.12, sz + book.h, book.w - 0.02, depth - 0.04, 0.005,
            '#F5F0E0', '#E8E0D0', '#DDD5C5');
          bx += book.w + 0.02;
        }
      }
    }
    const bendX = x + 0.12 + 7 * 0.15;
    const bendZ = z + 0.09 + 3 * 0.73;
    Iso.drawBox(ctx, bendX, y + 0.1, bendZ, 0.04, 0.3, 0.35, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, bendX - 0.08, y + 0.1, bendZ, 0.12, 0.3, 0.04, '#333', '#2A2A2A', '#222');
  },

  drawBookshelfRotated(ctx, x, y, z) {
    const col = '#6B4226';
    Iso.drawBox(ctx, x, y, z, 0.08, 2, 3, '#5C3A20', Iso.darken(col, 15), Iso.darken(col, 25));
    Iso.drawBox(ctx, x, y, z, 0.5, 0.06, 3, '#7A4E30', col, Iso.darken(col, 15));
    Iso.drawBox(ctx, x, y + 1.94, z, 0.5, 0.06, 3, '#7A4E30', col, Iso.darken(col, 15));
    Iso.drawBox(ctx, x, y, z + 2.95, 0.5, 2, 0.05, '#8B6914', col, Iso.darken(col, 10));
    for (let s = 0; s < 4; s++) {
      const sz = z + 0.05 + s * 0.73;
      Iso.drawBox(ctx, x + 0.08, y + 0.06, sz, 0.42, 1.88, 0.04, '#A07840', '#8B6914', '#7A5C10');
    }
    const shelfBooks = [
      [
        { w: 0.14, h: 0.58, col: '#C0392B' }, { w: 0.12, h: 0.55, col: '#2980B9' },
        { w: 0.16, h: 0.62, col: '#27AE60' }, { w: 0.10, h: 0.50, col: '#8E44AD' },
        { w: 0.13, h: 0.60, col: '#E67E22' }, { w: 0.15, h: 0.56, col: '#1ABC9C' },
        { w: 0.11, h: 0.48, col: '#F39C12' }, { w: 0.14, h: 0.54, col: '#E74C3C' },
        { w: 0.12, h: 0.58, col: '#3498DB' }, { w: 0.13, h: 0.52, col: '#9B59B6' },
      ],
      [
        { w: 0.13, h: 0.55, col: '#D35400' }, { w: 0.15, h: 0.60, col: '#2C3E50' },
        { w: 0.11, h: 0.45, col: '#16A085' }, { w: 0.14, h: 0.58, col: '#C0392B' },
        { w: 0.12, h: 0.50, col: '#7D3C98' },
        { w: 0.40, h: 0.08, col: '#2471A3', horiz: true, stack: 0 },
        { w: 0.38, h: 0.07, col: '#A93226', horiz: true, stack: 1 },
        { w: 0.42, h: 0.08, col: '#1E8449', horiz: true, stack: 2 },
        { w: 0.12, h: 0.52, col: '#AF601A' },
      ],
      [
        { w: 0.16, h: 0.62, col: '#922B21' }, { w: 0.11, h: 0.50, col: '#1A5276' },
        { w: 0.13, h: 0.56, col: '#196F3D' }, { w: 0.14, h: 0.60, col: '#7B241C' },
        { w: 0.10, h: 0.48, col: '#6C3483' }, { w: 0.15, h: 0.58, col: '#CA6F1E' },
        { w: 0.12, h: 0.54, col: '#117864' }, { w: 0.13, h: 0.52, col: '#A04000' },
        { w: 0.11, h: 0.50, col: '#1F618D' }, { w: 0.14, h: 0.56, col: '#884EA0' },
      ],
      [
        { w: 0.14, h: 0.55, col: '#B03A2E' }, { w: 0.12, h: 0.50, col: '#2E86C1' },
        { w: 0.15, h: 0.60, col: '#229954' }, { w: 0.13, h: 0.48, col: '#D4AC0D' },
        { w: 0.11, h: 0.52, col: '#7D3C98' }, { w: 0.14, h: 0.56, col: '#E74C3C' },
        { w: 0.12, h: 0.54, col: '#148F77' },
      ],
    ];
    for (let s = 0; s < 4; s++) {
      const sz = z + 0.09 + s * 0.73;
      const books = shelfBooks[s];
      let by = y + 0.12;
      for (const book of books) {
        if (book.horiz) {
          const stackZ = sz + book.stack * (book.h + 0.01);
          Iso.drawBox(ctx, x + 0.1, by, stackZ, 0.32, book.w, book.h,
            Iso.lighten(book.col, 25), book.col, Iso.darken(book.col, 25));
          if (book.stack === 2 || (!books.find(b => b.stack === book.stack + 1))) {
            Iso.drawBox(ctx, x + 0.12, by + 0.02, stackZ + book.h, 0.28, book.w - 0.04, 0.005,
              '#F5F0E0', '#E8E0D0', '#DDD5C5');
          }
          if (book.stack === 0) by += book.w + 0.03;
        } else {
          const depth = 0.32;
          Iso.drawBox(ctx, x + 0.1, by, sz, depth, book.w, book.h,
            Iso.lighten(book.col, 15), book.col, Iso.darken(book.col, 30));
          const spineBot = Iso.toScreen(x + 0.1 + depth + 0.01, by + book.w / 2, sz + book.h * 0.3);
          const spineTop = Iso.toScreen(x + 0.1 + depth + 0.01, by + book.w / 2, sz + book.h * 0.7);
          ctx.strokeStyle = Iso.lighten(book.col, 50);
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(spineBot.sx, spineBot.sy); ctx.lineTo(spineTop.sx, spineTop.sy); ctx.stroke();
          Iso.drawBox(ctx, x + 0.12, by + 0.01, sz + book.h, depth - 0.04, book.w - 0.02, 0.005,
            '#F5F0E0', '#E8E0D0', '#DDD5C5');
          by += book.w + 0.02;
        }
      }
    }
    const bendY = y + 0.12 + 7 * 0.15;
    const bendZ = z + 0.09 + 3 * 0.73;
    Iso.drawBox(ctx, x + 0.1, bendY, bendZ, 0.3, 0.04, 0.35, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x + 0.1, bendY - 0.08, bendZ, 0.3, 0.12, 0.04, '#333', '#2A2A2A', '#222');
  },

  drawCloset(ctx, x, y, z) {
    const col = '#E0E0E0';
    Iso.drawBox(ctx, x, y, z, 1.2, 0.6, 2.8, col, Iso.darken(col, 12), Iso.darken(col, 25));
    Iso.drawBox(ctx, x - 0.02, y - 0.02, z + 2.75, 1.24, 0.64, 0.08, Iso.lighten(col, 5), col, Iso.darken(col, 10));
    const splitBot = Iso.toScreen(x + 0.6, y + 0.61, z + 0.1);
    const splitTop = Iso.toScreen(x + 0.6, y + 0.61, z + 2.7);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(splitBot.sx, splitBot.sy); ctx.lineTo(splitTop.sx, splitTop.sy); ctx.stroke();
    const h1 = Iso.toScreen(x + 0.48, y + 0.62, z + 1.4);
    const h2 = Iso.toScreen(x + 0.72, y + 0.62, z + 1.4);
    ctx.fillStyle = '#B0B0B0';
    ctx.beginPath(); ctx.ellipse(h1.sx, h1.sy, 2, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(h2.sx, h2.sy, 2, 4, 0, 0, Math.PI * 2); ctx.fill();
    Iso.drawBox(ctx, x - 0.01, y - 0.01, z, 1.22, 0.62, 0.08, Iso.darken(col, 5), Iso.darken(col, 15), Iso.darken(col, 28));
  },

  drawClosetRotated(ctx, x, y, z) {
    const col = '#E0E0E0';
    Iso.drawBox(ctx, x, y, z, 0.6, 1.2, 2.8, col, Iso.darken(col, 12), Iso.darken(col, 25));
    Iso.drawBox(ctx, x - 0.02, y - 0.02, z + 2.75, 0.64, 1.24, 0.08, Iso.lighten(col, 5), col, Iso.darken(col, 10));
    const splitBot = Iso.toScreen(x + 0.61, y + 0.6, z + 0.1);
    const splitTop = Iso.toScreen(x + 0.61, y + 0.6, z + 2.7);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(splitBot.sx, splitBot.sy); ctx.lineTo(splitTop.sx, splitTop.sy); ctx.stroke();
    const h1 = Iso.toScreen(x + 0.62, y + 0.48, z + 1.4);
    const h2 = Iso.toScreen(x + 0.62, y + 0.72, z + 1.4);
    ctx.fillStyle = '#B0B0B0';
    ctx.beginPath(); ctx.ellipse(h1.sx, h1.sy, 2, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(h2.sx, h2.sy, 2, 4, 0, 0, Math.PI * 2); ctx.fill();
    Iso.drawBox(ctx, x - 0.01, y - 0.01, z, 0.62, 1.22, 0.08, Iso.darken(col, 5), Iso.darken(col, 15), Iso.darken(col, 28));
  },

  drawCoffeeMachine(ctx, x, y, z) {
    Iso.drawBox(ctx, x, y, 0, 0.8, 0.5, 0.88, '#8B7355', '#7A6348', '#6B553B');
    Iso.drawBox(ctx, x - 0.01, y - 0.01, 0.88, 0.82, 0.52, 0.03, '#A08060', '#8B7355', '#7A6348');
    Iso.drawBox(ctx, x + 0.1, y + 0.06, 0.91, 0.45, 0.32, 0.5, '#C8C8C8', '#B0B0B0', '#989898');
    Iso.drawBox(ctx, x + 0.08, y + 0.04, 1.41, 0.49, 0.36, 0.03, '#D4D4D4', '#C0C0C0', '#ABABAB');
    Iso.drawBox(ctx, x + 0.18, y + 0.1, 1.44, 0.3, 0.2, 0.2, 'rgba(120,80,40,0.5)', 'rgba(100,65,30,0.5)', 'rgba(80,50,20,0.5)');
    Iso.drawBox(ctx, x + 0.15, y + 0.12, 0.91, 0.35, 0.18, 0.02, '#666', '#555', '#444');
    Iso.drawBox(ctx, x + 0.28, y + 0.1, 1.15, 0.08, 0.06, 0.12, '#888', '#777', '#666');
    Iso.drawBox(ctx, x + 0.48, y + 0.14, 1.05, 0.04, 0.04, 0.25, '#AAA', '#999', '#888');
    const d1 = Iso.toScreen(x + 0.2, y - 0.01, 1.22);
    const d2 = Iso.toScreen(x + 0.42, y - 0.01, 1.22);
    const d3 = Iso.toScreen(x + 0.42, y - 0.01, 1.32);
    const d4 = Iso.toScreen(x + 0.2, y - 0.01, 1.32);
    ctx.fillStyle = '#1B5E20';
    ctx.beginPath();
    ctx.moveTo(d1.sx, d1.sy); ctx.lineTo(d2.sx, d2.sy);
    ctx.lineTo(d3.sx, d3.sy); ctx.lineTo(d4.sx, d4.sy);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(76, 175, 80, 0.25)';
    ctx.beginPath();
    ctx.moveTo(d1.sx, d1.sy); ctx.lineTo(d2.sx, d2.sy);
    ctx.lineTo(d3.sx, d3.sy); ctx.lineTo(d4.sx, d4.sy);
    ctx.closePath(); ctx.fill();
    Iso.drawBox(ctx, x + 0.25, y + 0.14, 0.93, 0.14, 0.14, 0.17, '#D4856A', '#C07558', '#AB6548');
    const light = Iso.toScreen(x + 0.5, y - 0.01, 1.18);
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath(); ctx.arc(light.sx, light.sy, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    ctx.beginPath(); ctx.arc(light.sx, light.sy, 4, 0, Math.PI * 2); ctx.fill();
  },

  drawBed(ctx, x, y, z) {
    const frameCol = '#F0F0F0';
    const baseZ = 1.0;
    // Solid frame (no legs)
    Iso.drawBox(ctx, x, y, 0, 3.5, 2.2, baseZ, frameCol, Iso.darken(frameCol, 8), Iso.darken(frameCol, 18));
    // Mattress
    Iso.drawBox(ctx, x + 0.1, y + 0.1, baseZ, 3.3, 2.0, 0.18, '#F5F5F5', '#E8E8E8', '#DCDCDC');
    // Blanket
    Iso.drawBox(ctx, x + 0.1, y + 0.1, baseZ + 0.18, 2.2, 2.0, 0.1, '#7986CB', '#5C6BC0', '#3F51B5');
    // Pillows
    Iso.drawBox(ctx, x + 2.5, y + 0.2, baseZ + 0.18, 0.7, 0.8, 0.15, '#FFF9C4', '#FFF59D', '#FFF176');
    Iso.drawBox(ctx, x + 2.5, y + 1.1, baseZ + 0.18, 0.7, 0.8, 0.15, '#FFF9C4', '#FFF59D', '#FFF176');
    // Headboard
    Iso.drawBox(ctx, x + 3.2, y, baseZ, 0.3, 2.2, 1.3, frameCol, Iso.darken(frameCol, 6), Iso.darken(frameCol, 15));
  },

  drawRug(ctx, x, y, w, d) {
    const tl = Iso.toScreen(x, y, 0.01);
    const tr = Iso.toScreen(x + w, y, 0.01);
    const br = Iso.toScreen(x + w, y + d, 0.01);
    const bl = Iso.toScreen(x, y + d, 0.01);
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath(); ctx.moveTo(tl.sx, tl.sy); ctx.lineTo(tr.sx, tr.sy);
    ctx.lineTo(br.sx, br.sy); ctx.lineTo(bl.sx, bl.sy); ctx.closePath(); ctx.fill();
    const margin = 0.3;
    const itl = Iso.toScreen(x + margin, y + margin, 0.01);
    const itr = Iso.toScreen(x + w - margin, y + margin, 0.01);
    const ibr = Iso.toScreen(x + w - margin, y + d - margin, 0.01);
    const ibl = Iso.toScreen(x + margin, y + d - margin, 0.01);
    ctx.strokeStyle = '#D7CCC8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(itl.sx, itl.sy); ctx.lineTo(itr.sx, itr.sy);
    ctx.lineTo(ibr.sx, ibr.sy); ctx.lineTo(ibl.sx, ibl.sy); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = 'rgba(215,204,200,0.3)'; ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const fraction = i / 4;
      const lS = Iso.toScreen(x + margin + fraction * (w - 2 * margin), y + margin, 0.01);
      const lE = Iso.toScreen(x + margin + fraction * (w - 2 * margin), y + d - margin, 0.01);
      ctx.beginPath(); ctx.moveTo(lS.sx, lS.sy); ctx.lineTo(lE.sx, lE.sy); ctx.stroke();
    }
  },

  drawFloorLamp(ctx, x, y, z) {
    Iso.drawBox(ctx, x, y, 0, 0.3, 0.3, 0.04, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x + 0.12, y + 0.12, 0.04, 0.06, 0.06, 2.2, '#555', '#444', '#333');
    Iso.drawBox(ctx, x - 0.05, y - 0.05, 2.0, 0.4, 0.4, 0.35, '#FFE0B2', '#FFD180', '#FFCC80');
  },

  drawDeskLamp(ctx, x, y, z) {
    Iso.drawBox(ctx, x, y, z, 0.15, 0.15, 0.02, '#444', '#333', '#222');
    Iso.drawBox(ctx, x + 0.05, y + 0.05, z + 0.02, 0.05, 0.05, 0.35, '#555', '#444', '#333');
    Iso.drawBox(ctx, x - 0.03, y - 0.03, z + 0.32, 0.2, 0.2, 0.1, '#FFE0B2', '#FFD180', '#FFCC80');
  },

  drawWeightRack(ctx, x, y, z) {
    const post = '#4A4A4A';
    Iso.drawBox(ctx, x + 0.02, y, z, 0.08, 0.08, 1.2, post, '#3A3A3A', '#2A2A2A');
    Iso.drawBox(ctx, x + 0.02, y + 0.9, z, 0.08, 0.08, 1.2, post, '#3A3A3A', '#2A2A2A');
    Iso.drawBox(ctx, x, y, z + 1.15, 0.12, 1.0, 0.05, '#666', '#555', '#444');
    const levels = [
      { sz: z + 0.1, plateH: 0.22, plateD: 0.18, col: '#333' },
      { sz: z + 0.42, plateH: 0.18, plateD: 0.15, col: '#444' },
      { sz: z + 0.7, plateH: 0.15, plateD: 0.12, col: '#555' },
    ];
    for (const lv of levels) {
      Iso.drawBox(ctx, x + 0.03, y + 0.02, lv.sz, 0.06, 0.94, 0.03, '#777', '#666', '#555');
      Iso.drawBox(ctx, x + 0.01, y + 0.15, lv.sz + 0.03, 0.1, lv.plateD, lv.plateH, lv.col, Iso.darken(lv.col, 12), Iso.darken(lv.col, 25));
      Iso.drawBox(ctx, x + 0.01, y + 0.65, lv.sz + 0.03, 0.1, lv.plateD, lv.plateH, lv.col, Iso.darken(lv.col, 12), Iso.darken(lv.col, 25));
    }
  },

  drawFloorDumbbell(ctx, x, y, z) {
    Iso.drawBox(ctx, x, y + 0.03, z + 0.02, 0.28, 0.03, 0.03, '#888', '#777', '#666');
    Iso.drawBox(ctx, x - 0.02, y, z, 0.06, 0.08, 0.07, '#444', '#333', '#222');
    Iso.drawBox(ctx, x + 0.24, y, z, 0.06, 0.08, 0.07, '#444', '#333', '#222');
  },

  drawPetBed(ctx, x, y, z) {
    const col = '#8D6E63';
    Iso.drawBox(ctx, x, y, z, 0.6, 0.5, 0.12, col, Iso.darken(col, 15), Iso.darken(col, 30));
    Iso.drawBox(ctx, x + 0.08, y + 0.08, z + 0.05, 0.44, 0.34, 0.1, '#BCAAA4', '#A1887F', '#8D6E63');
  },

  drawPictureFrame(ctx, x, y, z, w, h, frameCol, artCol) {
    Iso.drawBox(ctx, x, y, z, w, 0.04, h, frameCol, Iso.darken(frameCol, 10), Iso.darken(frameCol, 20));
    const m = 0.06;
    const p1 = Iso.toScreen(x + m, y + 0.045, z + m);
    const p2 = Iso.toScreen(x + w - m, y + 0.045, z + m);
    const p3 = Iso.toScreen(x + w - m, y + 0.045, z + h - m);
    const p4 = Iso.toScreen(x + m, y + 0.045, z + h - m);
    ctx.fillStyle = artCol;
    ctx.beginPath();
    ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy);
    ctx.lineTo(p3.sx, p3.sy); ctx.lineTo(p4.sx, p4.sy);
    ctx.closePath(); ctx.fill();
  },

  drawPictureFrameRotated(ctx, x, y, z, w, h, frameCol, artCol) {
    Iso.drawBox(ctx, x, y, z, 0.04, w, h, frameCol, Iso.darken(frameCol, 10), Iso.darken(frameCol, 20));
    const m = 0.06;
    const p1 = Iso.toScreen(x + 0.045, y + m, z + m);
    const p2 = Iso.toScreen(x + 0.045, y + w - m, z + m);
    const p3 = Iso.toScreen(x + 0.045, y + w - m, z + h - m);
    const p4 = Iso.toScreen(x + 0.045, y + m, z + h - m);
    ctx.fillStyle = artCol;
    ctx.beginPath();
    ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy);
    ctx.lineTo(p3.sx, p3.sy); ctx.lineTo(p4.sx, p4.sy);
    ctx.closePath(); ctx.fill();
  },

  drawDoorRotated(ctx, x, y, z) {
    const frameCol = '#5C4033';
    const doorCol = '#8B6914';
    // Door frame
    Iso.drawBox(ctx, x, y, z, 0.12, 1.8, 2.8, frameCol, Iso.darken(frameCol, 10), Iso.darken(frameCol, 20));
    // Door panel
    Iso.drawBox(ctx, x + 0.02, y + 0.1, z + 0.05, 0.08, 1.6, 2.6, doorCol, Iso.darken(doorCol, 8), Iso.darken(doorCol, 18));
    // Upper panel decoration
    Iso.drawBox(ctx, x + 0.03, y + 0.2, z + 1.5, 0.06, 1.4, 1.0, Iso.darken(doorCol, 12), Iso.darken(doorCol, 20), Iso.darken(doorCol, 28));
    // Lower panel decoration
    Iso.drawBox(ctx, x + 0.03, y + 0.2, z + 0.2, 0.06, 1.4, 1.0, Iso.darken(doorCol, 12), Iso.darken(doorCol, 20), Iso.darken(doorCol, 28));
    // Door handle
    const handlePos = Iso.toScreen(x + 0.13, y + 1.4, z + 1.3);
    ctx.fillStyle = '#B8860B';
    ctx.beginPath(); ctx.arc(handlePos.sx, handlePos.sy, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#DAA520';
    ctx.beginPath(); ctx.arc(handlePos.sx, handlePos.sy, 2, 0, Math.PI * 2); ctx.fill();
    // Threshold
    Iso.drawBox(ctx, x - 0.02, y - 0.02, z, 0.16, 1.84, 0.04, '#4A3228', '#3E2723', '#2E1E18');
  },

});
