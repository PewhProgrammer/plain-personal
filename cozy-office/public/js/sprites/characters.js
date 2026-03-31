// ── Sprites: Characters (boy/girl all poses) ────────────────────

Object.assign(Sprites, {

  drawBoy(ctx, x, y, z, frame) {
    const bob = Math.sin(frame * 0.05) * 0.02;
    Iso.drawBox(ctx, x + 0.05, y - 0.15, z, 0.15, 0.35, 0.15, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.3, y - 0.15, z, 0.15, 0.35, 0.15, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.05, y - 0.15, 0, 0.15, 0.15, z, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.3, y - 0.15, 0, 0.15, 0.15, z, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.03, y - 0.2, 0, 0.19, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x + 0.28, y - 0.2, 0, 0.19, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x, y + 0.0, z + 0.15 + bob, 0.5, 0.35, 0.5, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.05, y - 0.2, z + 0.25 + bob, 0.12, 0.3, 0.15, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x + 0.43, y - 0.2, z + 0.25 + bob, 0.12, 0.3, 0.15, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.05, y - 0.25, z + 0.25, 0.12, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.43, y - 0.25, z + 0.25, 0.12, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    const headZ = z + 0.65 + bob;
    Iso.drawBox(ctx, x + 0.08, y - 0.02, headZ, 0.35, 0.3, 0.35, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.05, y - 0.05, headZ + 0.25, 0.4, 0.33, 0.12, '#3E2723', '#2E1E18', '#1E1410');
    Iso.drawBox(ctx, x + 0.05, y + 0.25, headZ + 0.05, 0.4, 0.06, 0.25, '#3E2723', '#2E1E18', '#1E1410');
    const hpL = Iso.toScreen(x + 0.02, y + 0.1, headZ + 0.2);
    const hpR = Iso.toScreen(x + 0.48, y + 0.1, headZ + 0.2);
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(hpL.sx, hpL.sy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hpR.sx, hpR.sy, 5, 0, Math.PI * 2); ctx.fill();
    const hpTop = Iso.toScreen(x + 0.25, y + 0.05, headZ + 0.42);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(hpL.sx, hpL.sy);
    ctx.quadraticCurveTo(hpTop.sx, hpTop.sy - 5, hpR.sx, hpR.sy); ctx.stroke();
    const mL = Iso.toScreen(x + 0.15, y + 0.08, headZ + 0.1);
    const mR = Iso.toScreen(x + 0.35, y + 0.08, headZ + 0.1);
    const mM = Iso.toScreen(x + 0.25, y + 0.08, headZ + 0.07);
    ctx.strokeStyle = '#8B6060'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mL.sx, mL.sy);
    ctx.quadraticCurveTo(mM.sx, mM.sy + 2, mR.sx, mR.sy); ctx.stroke();
  },

  drawGirl(ctx, x, y, z, frame) {
    const bob = Math.sin(frame * 0.05 + 1) * 0.02;
    Iso.drawBox(ctx, x + 0.05, y + 0.1, 0, 0.13, 0.13, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.28, y + 0.1, 0, 0.13, 0.13, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.03, y + 0.08, 0, 0.17, 0.17, 0.06, '#8E44AD', '#7D3C98', '#6C3483');
    Iso.drawBox(ctx, x + 0.26, y + 0.08, 0, 0.17, 0.17, 0.06, '#8E44AD', '#7D3C98', '#6C3483');
    Iso.drawBox(ctx, x, y + 0.03, 0.6 + bob, 0.45, 0.32, 0.5, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x - 0.07, y + 0.08, 0.65 + bob, 0.1, 0.13, 0.35, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x + 0.42, y + 0.08, 0.65 + bob, 0.1, 0.13, 0.35, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x - 0.07, y + 0.08, 0.6, 0.1, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.42, y + 0.08, 0.6, 0.1, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    const headZ = 1.1 + bob;
    Iso.drawBox(ctx, x + 0.06, y + 0.03, headZ, 0.33, 0.28, 0.33, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.02, y + 0.0, headZ + 0.15, 0.41, 0.35, 0.2, '#4A2520', '#3A1815', '#2A1010');
    Iso.drawBox(ctx, x - 0.02, y + 0.05, headZ - 0.15, 0.08, 0.2, 0.35, '#4A2520', '#3A1815', '#2A1010');
    Iso.drawBox(ctx, x + 0.4, y + 0.05, headZ - 0.15, 0.08, 0.2, 0.35, '#4A2520', '#3A1815', '#2A1010');
    const gEyeL = Iso.toScreen(x + 0.0, y + 0.12, headZ + 0.18);
    const gEyeR = Iso.toScreen(x + 0.42, y + 0.12, headZ + 0.18);
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(gEyeL.sx, gEyeL.sy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(gEyeR.sx, gEyeR.sy, 4, 0, Math.PI * 2); ctx.fill();
    const gML = Iso.toScreen(x + 0.12, y + 0.1, headZ + 0.08);
    const gMR = Iso.toScreen(x + 0.3, y + 0.1, headZ + 0.08);
    const gMM = Iso.toScreen(x + 0.21, y + 0.1, headZ + 0.05);
    ctx.strokeStyle = '#C06060'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(gML.sx, gML.sy);
    ctx.quadraticCurveTo(gMM.sx, gMM.sy + 2, gMR.sx, gMR.sy); ctx.stroke();
    const clip = Iso.toScreen(x + 0.42, y + 0.15, headZ + 0.2);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(clip.sx, clip.sy, 3, 0, Math.PI * 2); ctx.fill();
  },

  drawBoyWalking(ctx, x, y, z, frame, dir) {
    dir = dir || 1;
    const legSwing = Math.sin(frame * 0.2) * 0.12;
    const armSwing = Math.sin(frame * 0.2 + Math.PI) * 0.08;
    const bodyBob = Math.abs(Math.sin(frame * 0.2)) * 0.025;
    const lOff = legSwing * dir;
    const rOff = -legSwing * dir;
    Iso.drawBox(ctx, x + 0.05, y + lOff, 0, 0.15, 0.15, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.03, y + lOff - 0.02, 0, 0.19, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x + 0.3, y + rOff, 0, 0.15, 0.15, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.28, y + rOff - 0.02, 0, 0.19, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    const bz = 0.6 + bodyBob;
    Iso.drawBox(ctx, x, y, bz, 0.5, 0.35, 0.5, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.05, y + armSwing * dir, bz + 0.05, 0.12, 0.25, 0.15, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x + 0.43, y - armSwing * dir, bz + 0.05, 0.12, 0.25, 0.15, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.05, y + armSwing * dir - 0.02, bz, 0.12, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.43, y - armSwing * dir - 0.02, bz, 0.12, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    const headZ = bz + 0.5 + bodyBob;
    Iso.drawBox(ctx, x + 0.08, y - 0.02, headZ, 0.35, 0.3, 0.35, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.05, y - 0.05, headZ + 0.25, 0.4, 0.33, 0.12, '#3E2723', '#2E1E18', '#1E1410');
    Iso.drawBox(ctx, x + 0.05, y + 0.25, headZ + 0.05, 0.4, 0.06, 0.25, '#3E2723', '#2E1E18', '#1E1410');
    const hpL = Iso.toScreen(x + 0.02, y + 0.1, headZ + 0.2);
    const hpR = Iso.toScreen(x + 0.48, y + 0.1, headZ + 0.2);
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(hpL.sx, hpL.sy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hpR.sx, hpR.sy, 5, 0, Math.PI * 2); ctx.fill();
    const hpTop = Iso.toScreen(x + 0.25, y + 0.05, headZ + 0.42);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(hpL.sx, hpL.sy);
    ctx.quadraticCurveTo(hpTop.sx, hpTop.sy - 5, hpR.sx, hpR.sy); ctx.stroke();
    const mL = Iso.toScreen(x + 0.15, y + 0.08, headZ + 0.1);
    const mR = Iso.toScreen(x + 0.35, y + 0.08, headZ + 0.1);
    const mM = Iso.toScreen(x + 0.25, y + 0.08, headZ + 0.07);
    ctx.strokeStyle = '#8B6060'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mL.sx, mL.sy);
    ctx.quadraticCurveTo(mM.sx, mM.sy + 2, mR.sx, mR.sy); ctx.stroke();
  },

  drawGirlWalking(ctx, x, y, z, frame, dir) {
    dir = dir || 1;
    const legSwing = Math.sin(frame * 0.2) * 0.1;
    const armSwing = Math.sin(frame * 0.2 + Math.PI) * 0.07;
    const bodyBob = Math.abs(Math.sin(frame * 0.2)) * 0.02;
    const lOff = legSwing * dir;
    const rOff = -legSwing * dir;
    Iso.drawBox(ctx, x + 0.05, y + 0.1 + lOff, 0, 0.13, 0.13, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.28, y + 0.1 + rOff, 0, 0.13, 0.13, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.03, y + 0.08 + lOff, 0, 0.17, 0.17, 0.06, '#8E44AD', '#7D3C98', '#6C3483');
    Iso.drawBox(ctx, x + 0.26, y + 0.08 + rOff, 0, 0.17, 0.17, 0.06, '#8E44AD', '#7D3C98', '#6C3483');
    const bz = 0.6 + bodyBob;
    Iso.drawBox(ctx, x, y + 0.03, bz, 0.45, 0.32, 0.5, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x - 0.07, y + 0.08 + armSwing * dir, bz + 0.05, 0.1, 0.13, 0.35, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x + 0.42, y + 0.08 - armSwing * dir, bz + 0.05, 0.1, 0.13, 0.35, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x - 0.07, y + 0.08 + armSwing * dir, bz, 0.1, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.42, y + 0.08 - armSwing * dir, bz, 0.1, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    const headZ = 1.1 + bodyBob;
    Iso.drawBox(ctx, x + 0.06, y + 0.03, headZ, 0.33, 0.28, 0.33, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.02, y + 0.0, headZ + 0.15, 0.41, 0.35, 0.2, '#4A2520', '#3A1815', '#2A1010');
    Iso.drawBox(ctx, x - 0.02, y + 0.05, headZ - 0.15, 0.08, 0.2, 0.35, '#4A2520', '#3A1815', '#2A1010');
    Iso.drawBox(ctx, x + 0.4, y + 0.05, headZ - 0.15, 0.08, 0.2, 0.35, '#4A2520', '#3A1815', '#2A1010');
    const gEyeL = Iso.toScreen(x + 0.0, y + 0.12, headZ + 0.18);
    const gEyeR = Iso.toScreen(x + 0.42, y + 0.12, headZ + 0.18);
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(gEyeL.sx, gEyeL.sy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(gEyeR.sx, gEyeR.sy, 4, 0, Math.PI * 2); ctx.fill();
    const gML = Iso.toScreen(x + 0.12, y + 0.1, headZ + 0.08);
    const gMR = Iso.toScreen(x + 0.3, y + 0.1, headZ + 0.08);
    const gMM = Iso.toScreen(x + 0.21, y + 0.1, headZ + 0.05);
    ctx.strokeStyle = '#C06060'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(gML.sx, gML.sy);
    ctx.quadraticCurveTo(gMM.sx, gMM.sy + 2, gMR.sx, gMR.sy); ctx.stroke();
    const clip = Iso.toScreen(x + 0.42, y + 0.15, headZ + 0.2);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(clip.sx, clip.sy, 3, 0, Math.PI * 2); ctx.fill();
  },

  drawBoyLying(ctx, x, y, z, frame) {
    const breathe = Math.sin(frame * 0.04) * 0.01;
    const bz = z + breathe;
    Iso.drawBox(ctx, x - 0.6, y + 0.02, bz, 0.55, 0.14, 0.14, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x - 0.6, y + 0.2, bz, 0.55, 0.14, 0.14, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x - 0.68, y + 0.01, bz, 0.1, 0.16, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x - 0.68, y + 0.19, bz, 0.1, 0.16, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x - 0.05, y, bz, 0.55, 0.38, 0.2, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.05, y - 0.08, bz, 0.4, 0.1, 0.12, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.05, y + 0.38, bz, 0.4, 0.1, 0.12, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x + 0.5, y + 0.03, bz, 0.3, 0.3, 0.28, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.5, y, bz + 0.18, 0.33, 0.35, 0.12, '#3E2723', '#2E1E18', '#1E1410');
  },

  drawGirlLying(ctx, x, y, z, frame) {
    const breathe = Math.sin(frame * 0.04 + 1) * 0.01;
    const bz = z + breathe;
    Iso.drawBox(ctx, x - 0.55, y + 0.04, bz, 0.5, 0.12, 0.12, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x - 0.55, y + 0.2, bz, 0.5, 0.12, 0.12, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x - 0.62, y + 0.03, bz, 0.08, 0.14, 0.06, '#8E44AD', '#7D3C98', '#6C3483');
    Iso.drawBox(ctx, x - 0.62, y + 0.19, bz, 0.08, 0.14, 0.06, '#8E44AD', '#7D3C98', '#6C3483');
    Iso.drawBox(ctx, x - 0.05, y + 0.01, bz, 0.5, 0.35, 0.18, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x, y - 0.06, bz, 0.35, 0.08, 0.1, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x, y + 0.36, bz, 0.35, 0.08, 0.1, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x + 0.45, y + 0.04, bz, 0.28, 0.28, 0.26, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.43, y + 0.01, bz + 0.12, 0.32, 0.34, 0.18, '#4A2520', '#3A1815', '#2A1010');
    const clip = Iso.toScreen(x + 0.75, y + 0.3, bz + 0.2);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(clip.sx, clip.sy, 2.5, 0, Math.PI * 2); ctx.fill();
  },

  drawBoyWorkout(ctx, x, y, z, frame) {
    Iso.drawBox(ctx, x + 0.02, y - 0.1, z, 0.15, 0.25, 0.5, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.30, y - 0.1, z, 0.15, 0.25, 0.5, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x, y - 0.15, z, 0.19, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x + 0.28, y - 0.15, z, 0.19, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x, y - 0.05, z + 0.5, 0.5, 0.35, 0.5, '#E74C3C', '#C0392B', '#A93226');
    Iso.drawBox(ctx, x + 0.08, y - 0.02, z + 1.0, 0.35, 0.3, 0.35, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.05, y - 0.05, z + 1.25, 0.4, 0.33, 0.12, '#3E2723', '#2E1E18', '#1E1410');
    const curl = Math.sin(frame * 0.1);
    const liftL = Math.max(0, curl) * 0.4;
    const liftR = Math.max(0, -curl) * 0.4;
    const lz = z + 0.5 + liftL;
    Iso.drawBox(ctx, x - 0.08, y - 0.1, lz, 0.12, 0.15, 0.2, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x - 0.12, y - 0.06, lz - 0.02, 0.2, 0.04, 0.04, '#888', '#777', '#666');
    Iso.drawBox(ctx, x - 0.15, y - 0.08, lz - 0.04, 0.06, 0.08, 0.08, '#555', '#444', '#333');
    Iso.drawBox(ctx, x + 0.05, y - 0.08, lz - 0.04, 0.06, 0.08, 0.08, '#555', '#444', '#333');
    const rz = z + 0.5 + liftR;
    Iso.drawBox(ctx, x + 0.44, y - 0.1, rz, 0.12, 0.15, 0.2, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.40, y - 0.06, rz - 0.02, 0.2, 0.04, 0.04, '#888', '#777', '#666');
    Iso.drawBox(ctx, x + 0.37, y - 0.08, rz - 0.04, 0.06, 0.08, 0.08, '#555', '#444', '#333');
    Iso.drawBox(ctx, x + 0.57, y - 0.08, rz - 0.04, 0.06, 0.08, 0.08, '#555', '#444', '#333');
  },

  drawBoySittingFloor(ctx, x, y, z, frame) {
    const breathe = Math.sin(frame * 0.03) * 0.01;
    Iso.drawBox(ctx, x - 0.05, y - 0.05, z, 0.5, 0.12, 0.08, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.1, y + 0.12, z, 0.25, 0.25, 0.08, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x - 0.1, y - 0.07, z, 0.12, 0.08, 0.05, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x + 0.33, y + 0.32, z, 0.12, 0.08, 0.05, '#333', '#2A2A2A', '#222');
    const bz = z + 0.08 + breathe;
    Iso.drawBox(ctx, x + 0.03, y - 0.02, bz, 0.42, 0.32, 0.42, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.05, y - 0.1, bz + 0.08, 0.12, 0.18, 0.12, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x + 0.38, y - 0.1, bz + 0.08, 0.12, 0.18, 0.12, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.05, y - 0.14, bz + 0.04, 0.1, 0.07, 0.07, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.38, y - 0.14, bz + 0.04, 0.1, 0.07, 0.07, '#FDBCB4', '#E8A89A', '#D49888');
    const headZ = bz + 0.42;
    Iso.drawBox(ctx, x + 0.08, y - 0.02, headZ, 0.3, 0.26, 0.3, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.05, y - 0.05, headZ + 0.2, 0.36, 0.3, 0.12, '#3E2723', '#2E1E18', '#1E1410');
    Iso.drawBox(ctx, x + 0.05, y + 0.2, headZ + 0.02, 0.36, 0.06, 0.22, '#3E2723', '#2E1E18', '#1E1410');
    const hpL = Iso.toScreen(x + 0.04, y + 0.06, headZ + 0.17);
    const hpR = Iso.toScreen(x + 0.42, y + 0.06, headZ + 0.17);
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(hpL.sx, hpL.sy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hpR.sx, hpR.sy, 4, 0, Math.PI * 2); ctx.fill();
    const hpTop = Iso.toScreen(x + 0.23, y + 0.01, headZ + 0.34);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(hpL.sx, hpL.sy);
    ctx.quadraticCurveTo(hpTop.sx, hpTop.sy - 4, hpR.sx, hpR.sy); ctx.stroke();
  },

  drawGirlSittingFloor(ctx, x, y, z, frame) {
    const breathe = Math.sin(frame * 0.03 + 1) * 0.01;
    Iso.drawBox(ctx, x - 0.05, y + 0.05, z, 0.45, 0.1, 0.08, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.1, y + 0.18, z, 0.22, 0.22, 0.08, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x - 0.08, y + 0.03, z, 0.1, 0.12, 0.05, '#8E44AD', '#7D3C98', '#6C3483');
    Iso.drawBox(ctx, x + 0.3, y + 0.34, z, 0.1, 0.1, 0.05, '#8E44AD', '#7D3C98', '#6C3483');
    const bz = z + 0.08 + breathe;
    Iso.drawBox(ctx, x + 0.03, y + 0.03, bz, 0.36, 0.26, 0.38, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x - 0.04, y - 0.03, bz + 0.06, 0.1, 0.16, 0.1, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x + 0.33, y - 0.03, bz + 0.06, 0.1, 0.16, 0.1, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x - 0.04, y - 0.07, bz + 0.03, 0.09, 0.07, 0.06, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.33, y - 0.07, bz + 0.03, 0.09, 0.07, 0.06, '#FDBCB4', '#E8A89A', '#D49888');
    const headZ = bz + 0.38;
    Iso.drawBox(ctx, x + 0.06, y + 0.03, headZ, 0.28, 0.22, 0.28, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.02, y + 0.0, headZ + 0.12, 0.36, 0.3, 0.18, '#4A2520', '#3A1815', '#2A1010');
    Iso.drawBox(ctx, x - 0.02, y + 0.05, headZ - 0.12, 0.07, 0.17, 0.3, '#4A2520', '#3A1815', '#2A1010');
    Iso.drawBox(ctx, x + 0.36, y + 0.05, headZ - 0.12, 0.07, 0.17, 0.3, '#4A2520', '#3A1815', '#2A1010');
    const clip = Iso.toScreen(x + 0.38, y + 0.16, headZ + 0.16);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(clip.sx, clip.sy, 2.5, 0, Math.PI * 2); ctx.fill();
  },

  drawBoyStretching(ctx, x, y, z, frame) {
    const sway = Math.sin(frame * 0.06) * 0.03;
    Iso.drawBox(ctx, x + 0.05, y - 0.15, 0, 0.15, 0.15, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.3, y - 0.15, 0, 0.15, 0.15, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.03, y - 0.2, 0, 0.19, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    Iso.drawBox(ctx, x + 0.28, y - 0.2, 0, 0.19, 0.1, 0.06, '#333', '#2A2A2A', '#222');
    const bz = 0.6;
    Iso.drawBox(ctx, x, y + 0.0, bz, 0.5, 0.35, 0.5, '#3498DB', '#2980B9', '#2471A3');
    const armLift = 0.3 + Math.sin(frame * 0.06) * 0.05;
    Iso.drawBox(ctx, x - 0.02 + sway, y - 0.1, bz + 0.35 + armLift, 0.12, 0.15, 0.2, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x + 0.4 - sway, y - 0.1, bz + 0.35 + armLift, 0.12, 0.15, 0.2, '#3498DB', '#2980B9', '#2471A3');
    Iso.drawBox(ctx, x - 0.02 + sway, y - 0.12, bz + 0.55 + armLift, 0.1, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.4 - sway, y - 0.12, bz + 0.55 + armLift, 0.1, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    const headZ = bz + 0.5;
    Iso.drawBox(ctx, x + 0.08, y - 0.02, headZ, 0.35, 0.3, 0.35, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.05, y - 0.05, headZ + 0.25, 0.4, 0.33, 0.12, '#3E2723', '#2E1E18', '#1E1410');
    Iso.drawBox(ctx, x + 0.05, y + 0.25, headZ + 0.05, 0.4, 0.06, 0.25, '#3E2723', '#2E1E18', '#1E1410');
  },

  drawGirlStretching(ctx, x, y, z, frame) {
    const sway = Math.sin(frame * 0.06 + 1) * 0.03;
    Iso.drawBox(ctx, x + 0.05, y + 0.1, 0, 0.13, 0.13, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.28, y + 0.1, 0, 0.13, 0.13, 0.6, '#2C3E50', '#1F2D3D', '#172230');
    Iso.drawBox(ctx, x + 0.03, y + 0.08, 0, 0.17, 0.17, 0.06, '#8E44AD', '#7D3C98', '#6C3483');
    Iso.drawBox(ctx, x + 0.26, y + 0.08, 0, 0.17, 0.17, 0.06, '#8E44AD', '#7D3C98', '#6C3483');
    const bz = 0.6;
    Iso.drawBox(ctx, x, y + 0.03, bz, 0.45, 0.32, 0.5, '#E91E63', '#C2185B', '#AD1457');
    const armLift = 0.3 + Math.sin(frame * 0.06 + 1) * 0.05;
    Iso.drawBox(ctx, x - 0.04 + sway, y + 0.08, bz + 0.35 + armLift, 0.1, 0.13, 0.2, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x + 0.39 - sway, y + 0.08, bz + 0.35 + armLift, 0.1, 0.13, 0.2, '#E91E63', '#C2185B', '#AD1457');
    Iso.drawBox(ctx, x - 0.04 + sway, y + 0.08, bz + 0.55 + armLift, 0.1, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.39 - sway, y + 0.08, bz + 0.55 + armLift, 0.1, 0.1, 0.08, '#FDBCB4', '#E8A89A', '#D49888');
    const headZ = 1.1;
    Iso.drawBox(ctx, x + 0.06, y + 0.03, headZ, 0.33, 0.28, 0.33, '#FDBCB4', '#E8A89A', '#D49888');
    Iso.drawBox(ctx, x + 0.02, y + 0.0, headZ + 0.15, 0.41, 0.35, 0.2, '#4A2520', '#3A1815', '#2A1010');
    Iso.drawBox(ctx, x - 0.02, y + 0.05, headZ - 0.15, 0.08, 0.2, 0.35, '#4A2520', '#3A1815', '#2A1010');
    Iso.drawBox(ctx, x + 0.4, y + 0.05, headZ - 0.15, 0.08, 0.2, 0.35, '#4A2520', '#3A1815', '#2A1010');
    const clip = Iso.toScreen(x + 0.42, y + 0.15, headZ + 0.2);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(clip.sx, clip.sy, 3, 0, Math.PI * 2); ctx.fill();
  },

});
