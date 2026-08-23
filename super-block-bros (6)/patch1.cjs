const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// 1. Interfaces
code = code.replace(
    `  lastHitBy?: { id: string, time: number };`,
    `  lastHitBy?: { id: string, time: number };
  brambleId?: string;
  brambleImmune?: number;`
);

code = code.replace(
    `    type: 'card' | 'boomerang' | 'fireball' | 'plate';`,
    `    type: 'card' | 'boomerang' | 'fireball' | 'plate' | 'thorn';`
);

// 2. Roster
code = code.replace(
    `  { id: 'wisp', name: 'Wisp', color: '#3b82f6', hp: 50, speedMult: 1.5 }
];`,
    `  { id: 'wisp', name: 'Wisp', color: '#3b82f6', hp: 50, speedMult: 1.5 },
  { id: 'cole', name: 'Cole', color: '#4b5563', hp: 150, speedMult: 0.5 },
  { id: 'oakwell', name: 'Oakwell', color: '#92400e', hp: 100, speedMult: 0.7 }
];`
);

// 3. Interval Wall check
code = code.replace(
    `            if (wall.type === 'fire' && wall.ownerId !== player.id && player.characterId !== 'wisp') {
                if (player.x < wall.x + wall.width && player.x + player.width > wall.x &&
                    player.y < wall.y + wall.height && player.y + player.height > wall.y) {
                    if (now % 500 < 35) {
                        applyDamage(player, 5, wall.ownerId, true);
                    }
                }
            }`,
    `            if (wall.type === 'fire' && wall.ownerId !== player.id && player.characterId !== 'wisp') {
                if (player.x < wall.x + wall.width && player.x + player.width > wall.x &&
                    player.y < wall.y + wall.height && player.y + player.height > wall.y) {
                    if (now % 500 < 35) {
                        applyDamage(player, 5, wall.ownerId, true);
                    }
                }
            } else if (wall.type === 'bramble' && wall.ownerId !== player.id) {
                if (player.brambleImmune && player.brambleImmune > now) continue;
                if (player.x < wall.x + wall.width && player.x + player.width > wall.x &&
                    player.y < wall.y + wall.height && player.y + player.height > wall.y) {
                    applyDamage(player, 15, wall.ownerId);
                    io.to(player.id).emit('applyKnockback', { vx: 0, vy: -5, stunFrames: 60 });
                    delete walls[wall.id];
                }
            }`
);

// 4. Abilities
code = code.replace(
    `                  walls[id2] = { id: id2, x: farthest.x + farthest.width + 20, y: farthest.y - 30, width: 20, height: 80, expires: Date.now() + 3000, type: 'fire', ownerId: player.id };
              }
          }
      }
  });`,
    `                  walls[id2] = { id: id2, x: farthest.x + farthest.width + 20, y: farthest.y - 30, width: 20, height: 80, expires: Date.now() + 3000, type: 'fire', ownerId: player.id };
              }
          }
      } else if (player.characterId === 'cole') {
          if (data.ability === 1) {
              io.emit('playerEffect', { id: player.id, effect: 'coleRoll' });
          } else if (data.ability === 2) {
              let nearest = null;
              let minDist = 9999;
              for (const p of Object.values(players)) {
                  if (p.id === player.id) continue;
                  const dist = Math.hypot(p.x - player.x, p.y - player.y);
                  if (dist < minDist) { minDist = dist; nearest = p; }
              }
              if (nearest) {
                  player.x = nearest.x;
                  player.y = nearest.y - 150;
                  io.emit('forcePosition', { id: player.id, x: player.x, y: player.y });
                  io.emit('playerEffect', { id: player.id, effect: 'teleport' });
              }
          } else if (data.ability === 3) {
              let crushed = false;
              for (const p of Object.values(players)) {
                  if (p.id === player.id) continue;
                  if (p.x < player.x + player.width && p.x + p.width > player.x && p.y > player.y) {
                      if (p.health < 30) {
                          applyDamage(p, p.maxHealth, player.id, true);
                          crushed = true;
                      }
                  }
              }
              if (crushed) io.emit('playerEffect', { id: player.id, effect: 'headSmash' });
          }
      } else if (player.characterId === 'oakwell') {
          if (data.ability === 1) {
              const id = 'proj_' + entityIdCounter++;
              projectiles[id] = {
                  id, type: 'thorn' as any,
                  x: player.x + (player.facing === 'right' ? player.width : -20),
                  y: player.y + player.height / 2,
                  vx: player.facing === 'right' ? 25 : -25,
                  vy: 0,
                  ownerId: player.id,
                  damage: 2,
                  life: 45
              };
          } else if (data.ability === 2) {
              if (player.brambleId && walls[player.brambleId]) return;
              const id = 'wall_' + entityIdCounter++;
              walls[id] = {
                  id, x: player.x, y: player.y + player.height - 10,
                  width: player.width, height: 10,
                  expires: Date.now() + 15000,
                  type: 'bramble', ownerId: player.id
              };
              player.brambleId = id;
          } else if (data.ability === 3) {
              const grounded = Object.values(players).filter(p => p.id !== player.id && p.isGrounded);
              if (grounded.length > 0) {
                  const target = grounded[Math.floor(Math.random() * grounded.length)];
                  target.x = player.x;
                  target.y = player.y;
                  io.emit('forcePosition', { id: target.id, x: target.x, y: target.y });
                  io.to(target.id).emit('applyKnockback', { vx: 0, vy: 0, stunFrames: 60 });
                  target.brambleImmune = Date.now() + 3000;
                  io.emit('playerEffect', { id: target.id, effect: 'brambleImmune' });
                  io.emit('playerEffect', { id: player.id, effect: 'teleport' });
              }
          }
      }
  });`
);
fs.writeFileSync('server.ts', code);
