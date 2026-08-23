const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// 1. Process Projectiles
code = code.replace(
`    // Process Projectiles
    for (const [id, proj] of Object.entries(projectiles)) {
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.life--;
        
        let hit = false;`,
`    // Process Projectiles
    for (const [id, proj] of Object.entries(projectiles)) {
        if (proj.type === 'boomerang') {
            if (proj.life > 30) {
                proj.vx -= (proj.vx > 0 ? 0.5 : -0.5);
            } else {
                const owner = players[proj.ownerId];
                if (owner) {
                    const dx = owner.x + owner.width/2 - proj.x;
                    const dy = owner.y + owner.height/2 - proj.y;
                    const len = Math.hypot(dx, dy);
                    if (len < 30) {
                        owner.boomerangActive = false;
                        owner.isSuperArmor = false;
                        // We need io to emit clearStun.
                        // I will handle clearStun directly here
                        proj.life = -1; // force delete
                    } else {
                        proj.vx = (dx / len) * 15;
                        proj.vy = (dy / len) * 15;
                    }
                }
            }
        } else if (proj.type === 'fireball') {
            let nearestTarget = null;
            let minDist = 9999;
            for (const p of Object.values(players)) {
                if (p.characterId === 'wisp') continue;
                const dist = Math.hypot(p.x - proj.x, p.y - proj.y);
                if (dist < minDist) { minDist = dist; nearestTarget = p; }
            }
            if (nearestTarget) {
                const dx = nearestTarget.x + nearestTarget.width / 2 - proj.x;
                const dy = nearestTarget.y + nearestTarget.height / 2 - proj.y;
                const len = Math.hypot(dx, dy);
                if (len > 0) {
                    proj.vx += (dx / len) * 0.5;
                    proj.vy += (dy / len) * 0.5;
                    const speed = Math.hypot(proj.vx, proj.vy);
                    if (speed > 10) { proj.vx = (proj.vx / speed) * 10; proj.vy = (proj.vy / speed) * 10; }
                }
            }
        }

        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.life--;
        
        let hit = false;`
);

// 2. Projectile hit logic for boomerang (does not get deleted on hit, unless life <= 0)
code = code.replace(
`                    if (player.health < beforeHp) {
                        io.to(player.id).emit('applyKnockback', { vx: proj.vx > 0 ? 10 : -10, vy: -5, stunFrames: 10 });
                    }
                    delete projectiles[id];
                    hit = true;
                    break;`,
`                    if (player.health < beforeHp) {
                        io.to(player.id).emit('applyKnockback', { vx: proj.vx > 0 ? 10 : -10, vy: -5, stunFrames: 10 });
                    }
                    if (proj.type !== 'boomerang') {
                        delete projectiles[id];
                        hit = true;
                        break;
                    }`
);

// 3. Projectile wall hit
code = code.replace(
`        if (!hit && projectiles[id]) {
            for (const wall of Object.values(walls)) {
                if (proj.x > wall.x && proj.x < wall.x + wall.width &&
                    proj.y > wall.y && proj.y < wall.y + wall.height) {
                    delete projectiles[id];
                    hit = true;
                    break;
                }
            }
        }`,
`        if (!hit && projectiles[id]) {
            for (const wall of Object.values(walls)) {
                if (proj.x > wall.x && proj.x < wall.x + wall.width &&
                    proj.y > wall.y && proj.y < wall.y + wall.height) {
                    if (proj.type !== 'boomerang') {
                        delete projectiles[id];
                        hit = true;
                        break;
                    }
                }
            }
        }`
);

// 4. Wombo Combo & Fire Wall
code = code.replace(
`    // Process DoTs and Safety Warp
    for (const player of Object.values(players)) {`,
`    // Process DoTs, Safety Warp, and Wombo Combo
    for (const player of Object.values(players)) {
        if (player.womboTimer && player.womboTimer > now) {
            // Hit every 0.3s (we can just use dots system or apply here directly if tick matches)
            // Actually, just check if frame count is multiple of 9 (30fps * 0.3 = 9 frames)
            // But we don't have frame count. Let's just use now % 300 < 33
            if (now % 300 < 35) {
                for (const target of Object.values(players)) {
                    if (target.id === player.id) continue;
                    const dist = Math.hypot(target.x - player.x, target.y - player.y);
                    if (dist < 80) {
                        applyDamage(target, 5, player.id);
                    }
                }
            }
        }
        
        // Fire wall damage
        for (const wall of Object.values(walls)) {
            if (wall.type === 'fire' && wall.ownerId !== player.id) {
                if (player.x < wall.x + wall.width && player.x + player.width > wall.x &&
                    player.y < wall.y + wall.height && player.y + player.height > wall.y) {
                    if (now % 500 < 35) {
                        applyDamage(player, 5, wall.ownerId, true);
                    }
                }
            }
        }
`
);

fs.writeFileSync('server.ts', code);
