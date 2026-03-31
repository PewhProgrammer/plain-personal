// ── Collision System (circle-vs-AABB with sliding) ──────────────

const COLLIDERS = [
  {x:1, y:0.15, w:3.5, d:1.5},
  {x:5, y:0.15, w:2.5, d:1.2},
  {x:8, y:0.15, w:0.8, d:0.5},
  {x:2.5, y:1.8, w:0.7, d:0.7},
  {x:8, y:5, w:3.5, d:2.2},
  {x:0.1, y:0.5, w:0.5, d:2.0},
  {x:0.1, y:3.5, w:0.6, d:1.2},
  {x:10.8, y:4, w:0.35, d:1.06},
  {x:0.5, y:9, w:0.3, d:0.3},
  {x:11, y:9, w:0.3, d:0.3},
  {x:1.5, y:8, w:0.45, d:0.45},
  {x:10, y:1, w:0.45, d:0.45},
  {x:3.0, y:8.5, w:0.45, d:0.45},
  {x:9.5, y:8.5, w:0.45, d:0.45},
  {x:5, y:8, w:0.6, d:0.5},
];

function _circleHitsBox(cx, cy, r, box) {
  const closestX = Math.max(box.x, Math.min(box.x + box.w, cx));
  const closestY = Math.max(box.y, Math.min(box.y + box.d, cy));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < r * r;
}

function _collidesAny(cx, cy, r, excludeIdx) {
  for (let i = 0; i < COLLIDERS.length; i++) {
    if (i === excludeIdx) continue;
    if (_circleHitsBox(cx, cy, r, COLLIDERS[i])) return true;
  }
  return false;
}

function _findColliderNear(x, y, r) {
  for (let i = 0; i < COLLIDERS.length; i++) {
    if (_circleHitsBox(x, y, r, COLLIDERS[i])) return i;
  }
  return -1;
}

function isInsideCollider(x, y) {
  for (const c of COLLIDERS) {
    if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.d) return true;
  }
  return false;
}

function _collidesAnyExcl(cx, cy, r, exclSet) {
  for (let i = 0; i < COLLIDERS.length; i++) {
    if (exclSet.has(i)) continue;
    if (_circleHitsBox(cx, cy, r, COLLIDERS[i])) return true;
  }
  return false;
}

function resolveMovement(oldX, oldY, newX, newY, radius, targetX, targetY) {
  newX = Math.max(radius, Math.min(ROOM_W - radius, newX));
  newY = Math.max(radius, Math.min(ROOM_D - radius, newY));

  const excl = new Set();
  for (let i = 0; i < COLLIDERS.length; i++) {
    if (_circleHitsBox(targetX, targetY, radius, COLLIDERS[i])) excl.add(i);
    if (_circleHitsBox(oldX, oldY, radius, COLLIDERS[i])) excl.add(i);
  }

  if (!_collidesAnyExcl(newX, newY, radius, excl)) {
    return {x: newX, y: newY};
  }
  if (!_collidesAnyExcl(newX, oldY, radius, excl)) {
    return {x: newX, y: oldY};
  }
  if (!_collidesAnyExcl(oldX, newY, radius, excl)) {
    return {x: oldX, y: newY};
  }
  return {x: oldX, y: oldY};
}
