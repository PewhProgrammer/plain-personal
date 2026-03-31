# Cozy Office - File Map

## Architecture
2.5D isometric office sim rendered on HTML5 Canvas. No build tools — plain `<script>` tags in global scope. Real-time clock drives schedule (work/boardgame/sleep). WebSocket for multiplayer chat + cuddle/workout triggers.

## File Map

### Core
| File | Lines | Purpose |
|------|-------|---------|
| `public/js/iso.js` | ~99 | Isometric math: `Iso.toScreen()`, `Iso.drawBox()`, `Iso.drawTile()` |
| `public/js/config.js` | ~170 | All constants: positions, dialogue, pet config, colors |
| `public/js/state.js` | ~150 | All mutable state: humans, pets, thoughts, weather, timers, localStorage init |
| `public/js/app.js` | ~75 | Entry point: resize, time display, initSchedule, game loop |

### Logic Modules
| File | Lines | Purpose |
|------|-------|---------|
| `public/js/weather.js` | ~40 | `updateWeather()`, `getSkyColors()`, `getDayNightAlpha()` |
| `public/js/humans.js` | ~450 | `humanTransition()`, `checkScheduleChange()`, `moveToward()`, `updateHumans()`, `updateThoughts()` |
| `public/js/pets.js` | ~300 | `distBetween()`, `pickRandomTarget()`, `findNearbyPet()`, `transitionState()`, `updatePets()` |
| `public/js/events.js` | ~200 | `updateFeeding()`, `updateDelivery()`, `updateNotifications()`, `updateVideoCall()`, `updateShootingStar()`, `updateBirds()` |
| `public/js/scene.js` | ~480 | `drawScene()`, `drawAmbientLight()`, `drawNightOverlay()` |

### Sprite Modules (all extend the global `Sprites` object)
| File | Lines | Purpose |
|------|-------|---------|
| `public/js/sprites/ui.js` | ~106 | **Defines** `const Sprites = {...}`. Bubbles, shadows, steam, zzz |
| `public/js/sprites/furniture.js` | ~500 | Desks, chair, bed, bookshelf, closet, coffee machine, lamps, rug, weight rack, pet bed |
| `public/js/sprites/characters.js` | ~400 | Boy/girl poses: sitting, walking, lying, stretching, workout, sitting-floor |
| `public/js/sprites/pets.js` | ~280 | Dog, cat, frog drawing (all states) |
| `public/js/sprites/environment.js` | ~325 | Window (with weather), curtains, plants, seasonal (tree, pumpkins, petals) |
| `public/js/sprites/misc.js` | ~95 | Speaker, sticky notes, food bowls, delivery person, board game |

### Server
| File | Lines | Purpose |
|------|-------|---------|
| `server.js` | ~122 | Express + WebSocket server, chat, identity, cuddle/workout events |

## Quick Reference: "To change X, edit Y"

| Change | File(s) |
|--------|---------|
| Dialogue / thoughts | `config.js` |
| Character positions | `config.js` (DESK_POS, CHAT_POS, BED_POS, etc.) |
| Pet behavior / AI | `pets.js` |
| Human state machine | `humans.js` |
| Schedule hours | `config.js` → `getCurrentSchedule()` in `state.js` |
| Weather logic | `weather.js` |
| Feeding / delivery | `events.js` |
| Room layout / furniture placement | `scene.js` → `drawScene()` |
| Furniture appearance | `sprites/furniture.js` |
| Character appearance | `sprites/characters.js` |
| Pet appearance | `sprites/pets.js` |
| Window / plants / seasons | `sprites/environment.js` |
| Lighting / night overlay | `scene.js` → `drawAmbientLight()`, `drawNightOverlay()` |
| UI bubbles / effects | `sprites/ui.js` |
| Game loop order | `app.js` |
| WebSocket / chat | `server.js` + inline `<script>` in `index.html` |

## Key Patterns
- `Sprites` object created in `sprites/ui.js`, extended via `Object.assign(Sprites, {...})` in other sprite files
- All files share global scope — no imports/exports
- Script loading order matters (see `index.html`)
- `lightDirty = true` triggers ambient light recalculation
- State machines use string-based states with `stateTimer` countdown
