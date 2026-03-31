// ── Isometric Engine ──────────────────────────────────────────────
const TILE_W = 64;
const TILE_H = 32;

const Iso = {
  // Convert grid (x, y, z) to screen pixels
  toScreen(x, y, z = 0) {
    return {
      sx: (x - y) * (TILE_W / 2),
      sy: (x + y) * (TILE_H / 2) - z * TILE_H
    };
  },

  // Draw a flat diamond floor tile
  drawFloorTile(ctx, sx, sy, color, strokeColor) {
    ctx.fillStyle = color;
    ctx.strokeStyle = strokeColor || 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy - TILE_H / 2);
    ctx.lineTo(sx + TILE_W / 2, sy);
    ctx.lineTo(sx, sy + TILE_H / 2);
    ctx.lineTo(sx - TILE_W / 2, sy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  // Draw an isometric box (rectangular prism)
  drawBox(ctx, x, y, z, w, d, h, topCol, leftCol, rightCol) {
    const tw = TILE_W / 2;
    const th = TILE_H / 2;

    // Top-left-back corner in screen space
    const base = this.toScreen(x, y, z);

    // Compute all 8 corners, but we only need the visible faces
    const corners = {
      topBackLeft:  this.toScreen(x, y, z + h),
      topBackRight: this.toScreen(x + w, y, z + h),
      topFrontRight: this.toScreen(x + w, y + d, z + h),
      topFrontLeft: this.toScreen(x, y + d, z + h),
      botBackRight: this.toScreen(x + w, y, z),
      botFrontRight: this.toScreen(x + w, y + d, z),
      botFrontLeft: this.toScreen(x, y + d, z),
    };

    // Top face
    ctx.fillStyle = topCol;
    ctx.beginPath();
    ctx.moveTo(corners.topBackLeft.sx, corners.topBackLeft.sy);
    ctx.lineTo(corners.topBackRight.sx, corners.topBackRight.sy);
    ctx.lineTo(corners.topFrontRight.sx, corners.topFrontRight.sy);
    ctx.lineTo(corners.topFrontLeft.sx, corners.topFrontLeft.sy);
    ctx.closePath();
    ctx.fill();

    // Left face (front-left)
    ctx.fillStyle = leftCol;
    ctx.beginPath();
    ctx.moveTo(corners.topFrontLeft.sx, corners.topFrontLeft.sy);
    ctx.lineTo(corners.topFrontRight.sx, corners.topFrontRight.sy);
    ctx.lineTo(corners.botFrontRight.sx, corners.botFrontRight.sy);
    ctx.lineTo(corners.botFrontLeft.sx, corners.botFrontLeft.sy);
    ctx.closePath();
    ctx.fill();

    // Right face (front-right)
    ctx.fillStyle = rightCol;
    ctx.beginPath();
    ctx.moveTo(corners.topBackRight.sx, corners.topBackRight.sy);
    ctx.lineTo(corners.topFrontRight.sx, corners.topFrontRight.sy);
    ctx.lineTo(corners.botFrontRight.sx, corners.botFrontRight.sy);
    ctx.lineTo(corners.botBackRight.sx, corners.botBackRight.sy);
    ctx.closePath();
    ctx.fill();
  },

  // Lighter / darker shade helpers
  lighten(hex, amt) {
    let r = parseInt(hex.slice(1,3), 16);
    let g = parseInt(hex.slice(3,5), 16);
    let b = parseInt(hex.slice(5,7), 16);
    r = Math.min(255, r + amt);
    g = Math.min(255, g + amt);
    b = Math.min(255, b + amt);
    return `rgb(${r},${g},${b})`;
  },

  darken(hex, amt) {
    let r = parseInt(hex.slice(1,3), 16);
    let g = parseInt(hex.slice(3,5), 16);
    let b = parseInt(hex.slice(5,7), 16);
    r = Math.max(0, r - amt);
    g = Math.max(0, g - amt);
    b = Math.max(0, b - amt);
    return `rgb(${r},${g},${b})`;
  }
};
