const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Patch Projectile Drone Collision
const targetProjDrone = `                        drone.hp -= proj.damage;
                        delete projectiles[id];
                        hit = true;
                        break;`;
const replaceProjDrone = `                        drone.hp -= proj.damage;
                        if (drone.type !== 'A') {
                            delete projectiles[id];
                            hit = true;
                            break;
                        }`;
if (code.includes(targetProjDrone)) {
    code = code.replace(targetProjDrone, replaceProjDrone);
    console.log("Patched Proj Drone Collision");
}

// Patch Drone Logic
const targetDroneLoop = `    // Process Drones
    for (const [id, drone] of Object.entries(drones)) {
        if (drone.hp <= 0) {
            delete drones[id];
            continue;
        }
        
        let nearestTarget = null;
        let minDist = 9999;
        for (const player of Object.values(players)) {
            if (player.characterId === 'rica') continue;
            const dist = Math.hypot(player.x - drone.x, player.y - drone.y);
            if (dist < minDist) {
                minDist = dist;
                nearestTarget = player;
            }
        }
        
        if (nearestTarget) {
            const dx = nearestTarget.x + nearestTarget.width / 2 - drone.x;
            const dy = nearestTarget.y + nearestTarget.height / 2 - drone.y;
            const len = Math.hypot(dx, dy);
            if (len > 0) {
                drone.vx = (dx / len) * 5;
                drone.vy = (dy / len) * 5;
            }
        }
        
        drone.x += drone.vx;
        drone.y += drone.vy;
        
        for (const wall of Object.values(walls)) {
            if (['bramble', 'bloodCloud'].includes(wall.type || '')) continue;
            if (drone.x > wall.x && drone.x < wall.x + wall.width &&
                drone.y > wall.y && drone.y < wall.y + wall.height) {
                if (wall.type === 'fire') {
                    drone.hp -= 20; // Breaks to fire walls
                } else {
                    drone.x -= drone.vx; // Stop on Mirage's walls
                    drone.y -= drone.vy;
                }
            }
        }
        
        for (const player of Object.values(players)) {
            if (player.characterId === 'rica') continue;
            if (drone.x > player.x && drone.x < player.x + player.width &&
                drone.y > player.y && drone.y < player.y + player.height) {
                
                const beforeHp = player.health;
                applyDamage(player, 15, drone.ownerId, true);
                if (player.health < beforeHp) {
                    io.to(player.id).emit('applyKnockback', { vx: drone.vx > 0 ? 5 : -5, vy: 15, stunFrames: 15 });
                }
                delete drones[id];
                break;
            }
        }
    }`;

const replaceDroneLoop = `    // Process Drones
    const currentDrones = { A: new Set(), B: new Set(), C: new Set() };
    for (const drone of Object.values(drones)) {
        if (drone.type && drone.hp > 0) currentDrones[drone.type as 'A'|'B'|'C'].add(drone.ownerId);
    }

    for (const [id, drone] of Object.entries(drones)) {
        if (drone.hp <= 0) {
            delete drones[id];
            continue;
        }
        
        let nearestTarget = null;
        let minDist = 9999;
        for (const player of Object.values(players)) {
            if (player.id === drone.ownerId) continue;
            if (player.characterId === 'rica') continue;
            const dist = Math.hypot(player.x - drone.x, player.y - drone.y);
            if (dist < minDist) {
                minDist = dist;
                nearestTarget = player;
            }
        }
        
        if (drone.type === 'C') {
            drone.angle = (drone.angle || 0) + 0.05;
            const owner = players[drone.ownerId];
            if (owner) {
                drone.x = owner.x + owner.width/2 + Math.cos(drone.angle)*60 - 10;
                drone.y = owner.y + owner.height/2 + Math.sin(drone.angle)*60 - 10;
            } else {
                drone.hp = 0; // owner died
            }
        } else if (nearestTarget) {
            const dx = nearestTarget.x + nearestTarget.width / 2 - drone.x;
            const dy = nearestTarget.y + nearestTarget.height / 2 - drone.y;
            const len = Math.hypot(dx, dy);
            if (len > 0) {
                const speed = drone.type === 'A' ? 1.5 : (drone.type === 'B' ? 12 : 5);
                drone.vx = (dx / len) * speed;
                drone.vy = (dy / len) * speed;
            }
        }
        
        if (drone.type !== 'C') {
            drone.x += drone.vx;
            drone.y += drone.vy;
        }
        
        for (const wall of Object.values(walls)) {
            if (['bramble', 'bloodCloud'].includes(wall.type || '')) continue;
            if (drone.x > wall.x && drone.x < wall.x + wall.width &&
                drone.y > wall.y && drone.y < wall.y + wall.height) {
                if (wall.type === 'fire') {
                    drone.hp -= 20; // Breaks to fire walls
                } else {
                    if (drone.type === 'B') {
                        drone.hp = 0;
                    } else if (drone.type !== 'C') {
                        drone.x -= drone.vx; // Stop on Mirage's walls
                        drone.y -= drone.vy;
                    }
                }
            }
        }
        
        for (const player of Object.values(players)) {
            if (player.id === drone.ownerId) continue;
            if (player.characterId === 'rica') continue;
            
            const radius = drone.type === 'A' ? 5 : (drone.type === 'B' ? 8 : (drone.type === 'C' ? 10 : 10));
            if (drone.x > player.x - radius && drone.x < player.x + player.width + radius &&
                drone.y > player.y - radius && drone.y < player.y + player.height + radius) {
                
                let dmg = 15;
                if (drone.type === 'A') dmg = 1;
                else if (drone.type === 'B') dmg = 10;
                else if (drone.type === 'C') dmg = 5;

                const beforeHp = player.health;
                applyDamage(player, dmg, drone.ownerId, true);
                if (player.health < beforeHp) {
                    io.to(player.id).emit('applyKnockback', { vx: drone.vx > 0 ? 5 : -5, vy: drone.type === 'C' ? -5 : 15, stunFrames: 15 });
                }
                drone.hp = 0;
                break;
            }
        }
    }
    
    // Process Drone Cooldowns
    for (const player of Object.values(players)) {
        if (player.characterId === 'neddy') {
            if (!currentDrones.A.has(player.id) && player.hadDronesA) {
                player.droneACooldown = Date.now() + 5000;
            }
            player.hadDronesA = currentDrones.A.has(player.id);
            
            if (!currentDrones.B.has(player.id) && player.hadDronesB) {
                player.droneBCooldown = Date.now() + 5000;
            }
            player.hadDronesB = currentDrones.B.has(player.id);
            
            if (!currentDrones.C.has(player.id) && player.hadDronesC) {
                player.droneCCooldown = Date.now() + 10000;
            }
            player.hadDronesC = currentDrones.C.has(player.id);
        }
    }`;

if (code.includes(targetDroneLoop)) {
    code = code.replace(targetDroneLoop, replaceDroneLoop);
    console.log("Patched Drone Loop");
} else {
    console.log("Drone Loop not found");
}

fs.writeFileSync('server.ts', code);
