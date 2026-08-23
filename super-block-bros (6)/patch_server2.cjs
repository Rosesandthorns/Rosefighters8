const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Abilities
const newAbilities = `      } else if (player.characterId === 'pinedo') {
          if (data.ability === 1) {
              const hitBox = {
                  x: player.facing === 'right' ? player.x + player.width : player.x - 40,
                  y: player.y,
                  width: 40, height: player.height
              };
              for (const target of Object.values(players)) {
                  if (target.id === player.id) continue;
                  if (target.x < hitBox.x + hitBox.width && target.x + target.width > hitBox.x &&
                      target.y < hitBox.y + hitBox.height && target.y + target.height > hitBox.y) {
                      const dmg = Math.min(30, target.maxHealth * 0.15);
                      applyDamage(target, dmg, player.id);
                      io.to(target.id).emit('applyKnockback', { vx: player.facing === 'right' ? 10 : -10, vy: -10, stunFrames: 30 });
                  }
              }
              io.to(player.id).emit('applyKnockback', { vx: 0, vy: 0, stunFrames: 30 });
              io.emit('playerEffect', { id: player.id, effect: 'headSmash' });
          } else if (data.ability === 2) {
              if (player.boomerangActive) return;
              player.boomerangActive = true;
              player.isSuperArmor = true;
              io.to(player.id).emit('applyKnockback', { vx: 0, vy: 0, stunFrames: 9999 });
              const id = 'proj_' + entityIdCounter++;
              projectiles[id] = {
                  id, type: 'boomerang',
                  x: player.x + (player.facing === 'right' ? player.width : -20),
                  y: player.y + player.height / 2,
                  vx: player.facing === 'right' ? 15 : -15,
                  vy: 0,
                  ownerId: player.id,
                  damage: 30,
                  life: 60
              };
          } else if (data.ability === 3) {
              player.womboTimer = Date.now() + 5000;
              io.emit('playerEffect', { id: player.id, effect: 'womboStart' });
          }
      } else if (player.characterId === 'morka') {
          if (data.ability === 1) {
              const id = 'proj_' + entityIdCounter++;
              projectiles[id] = {
                  id, type: 'plate',
                  x: player.x + (player.facing === 'right' ? player.width : -20),
                  y: player.y + player.height / 2,
                  vx: player.facing === 'right' ? 18 : -18,
                  vy: 0,
                  ownerId: player.id,
                  damage: 5,
                  life: 60
              };
          } else if (data.ability === 2) {
              if (!player.isGrounded) return;
              const hitBox = {
                  x: player.facing === 'right' ? player.x + player.width : player.x - 300,
                  y: player.y,
                  width: 300, height: player.height
              };
              let grabbed = null;
              for (const other of Object.values(players)) {
                  if (other.id === player.id) continue;
                  if (other.x < hitBox.x + hitBox.width && other.x + other.width > hitBox.x &&
                      other.y < hitBox.y + hitBox.height && other.y + other.height > hitBox.y) {
                      grabbed = other; break;
                  }
              }
              if (grabbed) {
                  player.grabbedPlayerId = grabbed.id;
                  grabbed.grabbedByPlayerId = player.id;
                  player.grabTimer = Date.now() + 2000;
                  io.emit('playerEffect', { id: player.id, effect: 'morkaGrab' });
                  setTimeout(() => { if (players[grabbed.id]) applyDamage(grabbed, 10, player.id); }, 500);
                  setTimeout(() => { if (players[grabbed.id]) applyDamage(grabbed, 10, player.id); }, 1000);
                  setTimeout(() => { 
                      if (players[grabbed.id] && players[player.id]) {
                          applyDamage(grabbed, 10, player.id);
                          io.to(grabbed.id).emit('applyKnockback', { vx: 0, vy: -30, stunFrames: 60 });
                          player.grabbedPlayerId = null;
                          grabbed.grabbedByPlayerId = null;
                      }
                  }, 1500);
              }
          } else if (data.ability === 3) {
              player.isInvincible = true;
              setTimeout(() => { if (players[player.id]) players[player.id].isInvincible = false; }, 500);
              io.to(player.id).emit('applyKnockback', { vx: 0, vy: -35, stunFrames: 0 }); 
          }
      } else if (player.characterId === 'wisp') {
          if (data.ability === 1) {
              const id = 'proj_' + entityIdCounter++;
              projectiles[id] = {
                  id, type: 'fireball',
                  x: player.x + (player.facing === 'right' ? player.width : -20),
                  y: player.y + player.height / 2,
                  vx: player.facing === 'right' ? 8 : -8,
                  vy: 0,
                  ownerId: player.id,
                  damage: 15,
                  life: 150
              };
          } else if (data.ability === 2) {
              const id = 'wall_' + entityIdCounter++;
              walls[id] = { 
                  id, x: player.x + (player.facing === 'right' ? 60 : -60), y: player.y - 30, 
                  width: 20, height: 80, expires: Date.now() + 5000, type: 'fire', ownerId: player.id 
              };
          } else if (data.ability === 3) {
              let farthest = null;
              let maxDist = -1;
              for (const other of Object.values(players)) {
                  if (other.id === player.id) continue;
                  const dist = Math.hypot(other.x - player.x, other.y - player.y);
                  if (dist > maxDist) { maxDist = dist; farthest = other; }
              }
              if (farthest) {
                  const tempX = player.x, tempY = player.y;
                  player.x = farthest.x; player.y = farthest.y;
                  farthest.x = tempX; farthest.y = tempY;
                  io.emit('forcePosition', { id: player.id, x: player.x, y: player.y });
                  io.emit('forcePosition', { id: farthest.id, x: farthest.x, y: farthest.y });
                  
                  const id1 = 'wall_' + entityIdCounter++;
                  walls[id1] = { id: id1, x: farthest.x - 40, y: farthest.y - 30, width: 20, height: 80, expires: Date.now() + 3000, type: 'fire', ownerId: player.id };
                  const id2 = 'wall_' + entityIdCounter++;
                  walls[id2] = { id: id2, x: farthest.x + farthest.width + 20, y: farthest.y - 30, width: 20, height: 80, expires: Date.now() + 3000, type: 'fire', ownerId: player.id };
              }
          }`;

code = code.replace(`              player.healLastHit = Date.now();
              io.emit('playerEffect', { id: player.id, effect: 'healStart' });
          }
      }
  });`, `              player.healLastHit = Date.now();
              io.emit('playerEffect', { id: player.id, effect: 'healStart' });
          }
${newAbilities}
      }
  });`);

fs.writeFileSync('server.ts', code);
