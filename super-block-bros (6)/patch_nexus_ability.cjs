const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `              io.emit('playerEffect', { id: player.id, effect: 'stab' });
          }
      }`;
      
const replacement = `              io.emit('playerEffect', { id: player.id, effect: 'stab' });
          }
      } else if (player.characterId === 'nexus') {
          if (data.ability === 1) {
              let hitSomeone = false;
              if (!player.staticChargeLastHit) player.staticChargeLastHit = Date.now();
              const seconds = Math.floor((Date.now() - player.staticChargeLastHit) / 1000);
              const dmg = Math.min(100, 1 + seconds);

              for (const p of Object.values(players)) {
                  if (p.id === player.id) continue;
                  const isFacingRight = player.facing === 'right';
                  const hitboxX = isFacingRight ? player.x + player.width : player.x - 60;
                  if (p.x < hitboxX + 60 && p.x + p.width > hitboxX && p.y < player.y + player.height && p.y + p.height > player.y) {
                      applyDamage(p, dmg, player.id);
                      io.to(p.id).emit('applyKnockback', { vx: isFacingRight ? 10 : -10, vy: -5, stunFrames: 15 });
                      hitSomeone = true;
                  }
              }
              if (hitSomeone) {
                  player.staticChargeLastHit = Date.now();
              }
              io.emit('playerEffect', { id: player.id, effect: 'nexusMelee' });
          } else if (data.ability === 2) {
              const now = Date.now();
              io.emit('globalFreeze', { endTime: now + 4000 });
              
              for (const p of Object.values(players)) {
                  io.to(p.id).emit('applyKnockback', { vx: 0, vy: 0, stunFrames: 240 }); // Stun on client for 4s
              }

              setTimeout(() => {
                  const playingIds = Object.keys(players);
                  const positions = playingIds.map(id => ({ x: players[id].x, y: players[id].y }));
                  positions.sort(() => Math.random() - 0.5);
                  playingIds.forEach((id, idx) => {
                      if (players[id]) {
                          players[id].x = positions[idx].x;
                          players[id].y = positions[idx].y;
                          io.emit('forcePosition', { id, x: players[id].x, y: players[id].y });
                          io.emit('playerEffect', { id, effect: 'teleport' });
                      }
                  });
              }, 2000);
          } else if (data.ability === 3) {
              const id = 'proj_' + entityIdCounter++;
              projectiles[id] = {
                  id, type: 'laser',
                  x: player.x + (player.facing === 'right' ? player.width : -20),
                  y: player.y + player.height / 2,
                  startX: player.x,
                  startY: player.y,
                  vx: player.facing === 'right' ? 25 : -25,
                  vy: 0,
                  ownerId: player.id,
                  damage: 10,
                  life: 1500
              };
          }
      }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched Nexus abilities");
}
fs.writeFileSync('server.ts', code);
