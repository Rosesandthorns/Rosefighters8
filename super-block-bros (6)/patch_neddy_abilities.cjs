const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `      } else if (player.characterId === 'nexus') {`;
const replacement = `      } else if (player.characterId === 'neddy') {
          if (data.ability === 1) {
              if (player.hadDronesA || (player.droneACooldown && Date.now() < player.droneACooldown)) return;
              for (let i = 0; i < 30; i++) {
                  const id = 'drone_' + entityIdCounter++;
                  drones[id] = {
                      id, x: player.x + (Math.random() - 0.5) * 100, y: player.y - 40 + (Math.random() - 0.5) * 100,
                      vx: 0, vy: 0, ownerId: player.id, hp: 1, type: 'A'
                  };
              }
              player.hadDronesA = true;
          } else if (data.ability === 2) {
              if (player.hadDronesB || (player.droneBCooldown && Date.now() < player.droneBCooldown)) return;
              for (let i = 0; i < 5; i++) {
                  const id = 'drone_' + entityIdCounter++;
                  drones[id] = {
                      id, x: player.x + (Math.random() - 0.5) * 50, y: player.y - 40 + (Math.random() - 0.5) * 50,
                      vx: 0, vy: 0, ownerId: player.id, hp: 1, type: 'B'
                  };
              }
              player.hadDronesB = true;
          } else if (data.ability === 3) {
              if (player.hadDronesC || (player.droneCCooldown && Date.now() < player.droneCCooldown)) return;
              for (let i = 0; i < 8; i++) {
                  const id = 'drone_' + entityIdCounter++;
                  drones[id] = {
                      id, x: player.x, y: player.y,
                      vx: 0, vy: 0, ownerId: player.id, hp: 1, type: 'C',
                      angle: (i / 8) * Math.PI * 2
                  };
              }
              player.hadDronesC = true;
          }
      } else if (player.characterId === 'nexus') {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched Neddy Abilities Server");
}
fs.writeFileSync('server.ts', code);
