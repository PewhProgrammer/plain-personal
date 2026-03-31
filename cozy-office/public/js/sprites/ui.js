// ── Sprites: UI elements (bubbles, shadows, steam, zzz) ────────

const Sprites = {

  _drawShadow(ctx, x, y, radiusX, radiusY, alpha) {
    const pos = Iso.toScreen(x, y, 0.01);
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha || 0.1})`;
    ctx.beginPath();
    ctx.ellipse(pos.sx, pos.sy, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  _drawZzz(ctx, pos, frame) {
    const t = frame * 0.02;
    ctx.fillStyle = 'rgba(200, 200, 255, 0.6)';
    for (let i = 0; i < 3; i++) {
      const phase = (t + i * 0.8) % 2.4;
      if (phase > 2) continue;
      const alpha = phase < 1.5 ? 0.7 : 0.7 * (2 - phase) / 0.5;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.font = `bold ${7 + i * 2}px monospace`;
      ctx.fillText('z', pos.sx + i * 6 + phase * 3, pos.sy - 5 - i * 8 - phase * 8);
    }
    ctx.globalAlpha = 1;
  },

  _drawSteam(ctx, x, y, z, frame) {
    for (let i = 0; i < 3; i++) {
      const phase = ((frame * 0.025 + i * 0.8) % 2);
      const alpha = phase < 1.2 ? 0.3 : 0.3 * (2 - phase) / 0.8;
      if (alpha <= 0) continue;
      const sp = Iso.toScreen(x + Math.sin(i + frame * 0.02) * 0.05, y, z + 0.1 + phase * 0.15);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`;
      ctx.beginPath(); ctx.arc(sp.sx, sp.sy, 2.5 + phase, 0, Math.PI * 2); ctx.fill();
    }
  },

  drawSpeechBubble(ctx, x, y, z, text, alpha) {
    const pos = Iso.toScreen(x, y, z);
    ctx.globalAlpha = alpha;
    const bx = pos.sx + 8;
    const by = pos.sy - 16;
    ctx.font = '10px "Courier New", monospace';
    const textW = ctx.measureText(text).width;
    const pw = textW + 16;
    const ph = 22;
    const r = 8;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(bx + r, by - ph / 2);
    ctx.lineTo(bx + pw - r, by - ph / 2);
    ctx.quadraticCurveTo(bx + pw, by - ph / 2, bx + pw, by - ph / 2 + r);
    ctx.lineTo(bx + pw, by + ph / 2 - r);
    ctx.quadraticCurveTo(bx + pw, by + ph / 2, bx + pw - r, by + ph / 2);
    ctx.lineTo(bx + r, by + ph / 2);
    ctx.quadraticCurveTo(bx, by + ph / 2, bx, by + ph / 2 - r);
    ctx.lineTo(bx, by - ph / 2 + r);
    ctx.quadraticCurveTo(bx, by - ph / 2, bx + r, by - ph / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(bx + 8, by + ph / 2 - 1);
    ctx.lineTo(bx - 2, by + ph / 2 + 10);
    ctx.lineTo(bx + 18, by + ph / 2 - 1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.fillText(text, bx + 8, by + 4);
    ctx.globalAlpha = 1;
  },

  drawThoughtBubble(ctx, x, y, z, text, alpha) {
    const pos = Iso.toScreen(x, y, z);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.arc(pos.sx + 5, pos.sy + 8, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(pos.sx + 10, pos.sy + 1, 4, 0, Math.PI * 2); ctx.fill();
    const bx = pos.sx + 15;
    const by = pos.sy - 12;
    ctx.font = '10px "Courier New", monospace';
    const textW = ctx.measureText(text).width;
    const pw = textW + 16;
    const ph = 22;
    const r = 8;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.moveTo(bx + r, by - ph / 2);
    ctx.lineTo(bx + pw - r, by - ph / 2);
    ctx.quadraticCurveTo(bx + pw, by - ph / 2, bx + pw, by - ph / 2 + r);
    ctx.lineTo(bx + pw, by + ph / 2 - r);
    ctx.quadraticCurveTo(bx + pw, by + ph / 2, bx + pw - r, by + ph / 2);
    ctx.lineTo(bx + r, by + ph / 2);
    ctx.quadraticCurveTo(bx, by + ph / 2, bx, by + ph / 2 - r);
    ctx.lineTo(bx, by - ph / 2 + r);
    ctx.quadraticCurveTo(bx, by - ph / 2, bx + r, by - ph / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillText(text, bx + 8, by + 4);
    ctx.globalAlpha = 1;
  },

};
