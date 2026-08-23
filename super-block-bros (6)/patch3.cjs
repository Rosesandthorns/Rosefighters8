const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
    `const ROSTER = [
  { id: 'mirage', name: 'Mirage', color: '#a855f7', hp: 80, speedMult: 1.0 },
  { id: 'orbo', name: 'Orbo', color: '#06b6d4', hp: 60, speedMult: 1.0 },
  { id: 'rica', name: 'Rica', color: '#ef4444', hp: 120, speedMult: 0.8 },
  { id: 'chester', name: 'Chester', color: '#8b4513', hp: 200, speedMult: 0.2 },
  { id: 'pinedo', name: 'Pinedo', color: '#ffffff', hp: 100, speedMult: 1.0 },
  { id: 'morka', name: 'Morka', color: '#6b7280', hp: 120, speedMult: 1.2 },
  { id: 'wisp', name: 'Wisp', color: '#3b82f6', hp: 50, speedMult: 1.5 },
  { id: 'cole', name: 'Cole', color: '#4b5563', hp: 150, speedMult: 0.5 },
  { id: 'oakwell', name: 'Oakwell', color: '#92400e', hp: 100, speedMult: 0.7 }
];`,
    `const ROSTER = [
  { id: 'mirage', name: 'Mirage', color: '#a855f7', hp: 80, speedMult: 1.0, category: 'Mirage Park' },
  { id: 'orbo', name: 'Orbo', color: '#06b6d4', hp: 60, speedMult: 1.0, category: 'Mirage Park' },
  { id: 'rica', name: 'Rica', color: '#ef4444', hp: 120, speedMult: 0.8, category: 'Mirage Park' },
  { id: 'chester', name: 'Chester', color: '#8b4513', hp: 200, speedMult: 0.2, category: 'Mirage Park' },
  { id: 'pinedo', name: 'Pinedo', color: '#ffffff', hp: 100, speedMult: 1.0, category: 'Mirage Park' },
  { id: 'morka', name: 'Morka', color: '#6b7280', hp: 120, speedMult: 1.2, category: 'Mirage Park' },
  { id: 'wisp', name: 'Wisp', color: '#3b82f6', hp: 50, speedMult: 1.5, category: 'Mirage Park' },
  { id: 'cole', name: 'Cole', color: '#4b5563', hp: 150, speedMult: 0.5, category: 'Mirage Park' },
  { id: 'oakwell', name: 'Oakwell', color: '#92400e', hp: 150, speedMult: 0.7, category: 'Mirage Park' },
  { id: 'pip', name: 'Pip', color: '#991b1b', hp: 30, speedMult: 3.0, category: 'Rose Valley' }
];`
);

code = code.replace(
    `            } else if (wall.type === 'bramble' && wall.ownerId !== player.id) {
                if (player.brambleImmune && player.brambleImmune > now) continue;
                if (player.x < wall.x + wall.width && player.x + player.width > wall.x &&
                    player.y < wall.y + wall.height && player.y + player.height > wall.y) {
                    applyDamage(player, 15, wall.ownerId);
                    io.to(player.id).emit('applyKnockback', { vx: 0, vy: -5, stunFrames: 60 });
                    delete walls[wall.id];
                }
            }`,
    `            } else if (wall.type === 'bramble' && wall.ownerId !== player.id) {
                if (player.brambleImmune && player.brambleImmune > now) continue;
                if (player.x < wall.x + wall.width && player.x + player.width > wall.x &&
                    player.y < wall.y + wall.height && player.y + player.height > wall.y) {
                    applyDamage(player, 15, wall.ownerId);
                    io.to(player.id).emit('applyKnockback', { vx: 0, vy: -5, stunFrames: 60 });
                    delete walls[wall.id];
                }
            } else if (wall.type === 'bloodCloud' && wall.ownerId !== player.id) {
                if (player.x < wall.x + wall.width && player.x + player.width > wall.x &&
                    player.y < wall.y + wall.height && player.y + player.height > wall.y) {
                    if (now % 500 < 35) {
                        applyDamage(player, 8, wall.ownerId, true);
                    }
                }
            }`
);

code = code.replace(
    `                  io.emit('playerEffect', { id: target.id, effect: 'brambleImmune' });
                  io.emit('playerEffect', { id: player.id, effect: 'teleport' });
              }
          }
      }
  });`,
    `                  io.emit('playerEffect', { id: target.id, effect: 'brambleImmune' });
                  io.emit('playerEffect', { id: player.id, effect: 'teleport' });
              }
          }
      } else if (player.characterId === 'pip') {
          if (data.ability === 1) {
              const id = 'wall_' + entityIdCounter++;
              walls[id] = {
                  id, x: player.x - 50, y: player.y - 80,
                  width: 150, height: 150,
                  expires: Date.now() + 6000,
                  type: 'bloodCloud', ownerId: player.id
              };
          } else if (data.ability === 2) {
              let target = null;
              let minDist = 120;
              for (const p of Object.values(players)) {
                  if (p.id === player.id) continue;
                  const dist = Math.hypot(p.x - player.x, p.y - player.y);
                  if (dist < minDist && p.health < 30) {
                      minDist = dist;
                      target = p;
                  }
              }
              if (target) {
                  player.x = target.x;
                  player.y = target.y;
                  io.emit('forcePosition', { id: player.id, x: player.x, y: player.y });
                  applyDamage(target, target.maxHealth, player.id, true);
                  io.emit('playerEffect', { id: player.id, effect: 'headSmash' });
              }
          } else if (data.ability === 3) {
              const hitBox = {
                  x: player.facing === 'right' ? player.x + player.width : player.x - 40,
                  y: player.y,
                  width: 40, height: player.height
              };
              for (const target of Object.values(players)) {
                  if (target.id === player.id) continue;
                  if (target.x < hitBox.x + hitBox.width && target.x + target.width > hitBox.x &&
                      target.y < hitBox.y + hitBox.height && target.y + target.height > hitBox.y) {
                      applyDamage(target, 15, player.id);
                      io.to(target.id).emit('applyKnockback', { vx: player.facing === 'right' ? 8 : -8, vy: -5, stunFrames: 15 });
                  }
              }
              io.emit('playerEffect', { id: player.id, effect: 'stab' });
          }
      }
  });`
);
fs.writeFileSync('server.ts', code);
