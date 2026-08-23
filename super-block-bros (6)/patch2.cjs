const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

// 1. Interfaces
code = code.replace(
    `    type: 'card' | 'boomerang' | 'fireball' | 'plate';`,
    `    type: 'card' | 'boomerang' | 'fireball' | 'plate' | 'thorn';`
);

code = code.replace(
    `  { id: 'wisp', name: 'Wisp', color: '#3b82f6', hp: 50 }
];`,
    `  { id: 'wisp', name: 'Wisp', color: '#3b82f6', hp: 50 },
  { id: 'cole', name: 'Cole', color: '#4b5563', hp: 150 },
  { id: 'oakwell', name: 'Oakwell', color: '#92400e', hp: 100 }
];`
);

// 2. Effects parsing
code = code.replace(
    `        if (data.effect === 'healStart') {
            p.activeEffects['healBuff'] = Date.now() + 5000;
        }`,
    `        if (data.effect === 'healStart') {
            p.activeEffects['healBuff'] = Date.now() + 5000;
        }
        if (data.effect === 'coleRoll') {
            p.activeEffects['coleRoll'] = Date.now() + 1000;
        }
        if (data.effect === 'brambleImmune') {
            p.activeEffects['brambleImmune'] = Date.now() + 3000;
        }`
);

// 3. Movement
code = code.replace(
    `              if (myPlayer.activeEffects?.['ricaRun'] && myPlayer.activeEffects['ricaRun'] > Date.now()) {`,
    `              if (myPlayer.activeEffects?.['coleRoll'] && myPlayer.activeEffects['coleRoll'] > Date.now()) {
                  moveTarget = myPlayer.facing === 'right' ? MOVE_SPEED * 2 : -MOVE_SPEED * 2;
              } else if (myPlayer.activeEffects?.['ricaRun'] && myPlayer.activeEffects['ricaRun'] > Date.now()) {`
);

// 4. Active Hitboxes
code = code.replace(
    `      if ((myPlayer.activeEffects?.['ricaRun'] && myPlayer.activeEffects['ricaRun'] > Date.now()) || 
          (myPlayer.activeEffects?.['toothDash'] && myPlayer.activeEffects['toothDash'] > Date.now())) {
          
          const isRica = myPlayer.activeEffects?.['ricaRun'] > Date.now();
          const damage = isRica ? 30 : 10;`,
    `      const isColeRoll = myPlayer.activeEffects?.['coleRoll'] && myPlayer.activeEffects['coleRoll'] > Date.now();
      if ((myPlayer.activeEffects?.['ricaRun'] && myPlayer.activeEffects['ricaRun'] > Date.now()) || 
          (myPlayer.activeEffects?.['toothDash'] && myPlayer.activeEffects['toothDash'] > Date.now()) || isColeRoll) {
          
          const isRica = myPlayer.activeEffects?.['ricaRun'] > Date.now();
          const damage = isColeRoll ? 0 : (isRica ? 30 : 10);`
);

code = code.replace(
    `                  if (isRica) {
                      socket.emit('playerKnockback', {
                          targetId: target.id,
                          vx: dirX * 18,
                          vy: -15,
                          stunFrames: 25
                      });
                  } else {`,
    `                  if (isColeRoll) {
                      socket.emit('playerKnockback', {
                          targetId: target.id,
                          vx: dirX * 15,
                          vy: -10,
                          stunFrames: 20
                      });
                  } else if (isRica) {
                      socket.emit('playerKnockback', {
                          targetId: target.id,
                          vx: dirX * 18,
                          vy: -15,
                          stunFrames: 25
                      });
                  } else {`
);

// 5. Abilities cooldown
code = code.replace(
    `          if (mouseButtons[0] && abilityCooldownsRef.current[1] === 0 && !myPlayer.isGrabbingLedge) {
              socket.emit('useAbility', { ability: 1 });
              abilityCooldownsRef.current[1] = 60; // 1s cooldown`,
    `          const isOakwell = myPlayer.characterId === 'oakwell';
          if (mouseButtons[0] && abilityCooldownsRef.current[1] === 0 && !myPlayer.isGrabbingLedge) {
              socket.emit('useAbility', { ability: 1 });
              abilityCooldownsRef.current[1] = isOakwell ? 15 : 60; // 0.5s for Oakwell`
);

// 6. Ground Slam Cole mod
code = code.replace(
    `              // Trigger Slam!
              myPlayer.isStunned = true;
              myPlayer.isAttacking = false;
              
              const slamX = myPlayer.x + myPlayer.width / 2;
              const slamY = myPlayer.y + myPlayer.height;`,
    `              // Trigger Slam!
              myPlayer.isStunned = true;
              myPlayer.isAttacking = false;
              
              const isCole = myPlayer.characterId === 'cole';
              const slamDamage = isCole ? 50 : 20;
              const victimStun = isCole ? 40 : 20;

              const slamX = myPlayer.x + myPlayer.width / 2;
              const slamY = myPlayer.y + myPlayer.height;`
);

code = code.replace(
    `                      socket.emit('playerHit', { targetId: target.id, damage: 20 });
                      
                      const dirX = targetCenterX > slamX ? 1 : -1;
                      const knockbackX = dirX * (20 - (dist / 120) * 10);
                      const knockbackY = -15;
                      
                      socket.emit('playerKnockback', { 
                          targetId: target.id, 
                          vx: knockbackX, 
                          vy: knockbackY,
                          stunFrames: 20 
                      });`,
    `                      socket.emit('playerHit', { targetId: target.id, damage: slamDamage });
                      
                      const dirX = targetCenterX > slamX ? 1 : -1;
                      const knockbackX = dirX * (20 - (dist / 120) * 10);
                      const knockbackY = -15;
                      
                      socket.emit('playerKnockback', { 
                          targetId: target.id, 
                          vx: knockbackX, 
                          vy: knockbackY,
                          stunFrames: victimStun 
                      });`
);

code = code.replace(
    `              stunTimerRef.current = hitSomeone ? 12 : 24; // 2x longer stun if we hit no one
          }
          myPlayer.isFastFalling = false;`,
    `              if (isCole) {
                  stunTimerRef.current = hitSomeone ? 20 : 40;
              } else {
                  stunTimerRef.current = hitSomeone ? 12 : 24;
              }
          }
          myPlayer.isFastFalling = false;`
);

// 7. Rendering (Walls, Projectiles, Body, Auras)
code = code.replace(
    `          } else {
              ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
              ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
              ctx.strokeStyle = '#a855f7';
              ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
          }
      });`,
    `          } else if (wall.type === 'bramble') {
              ctx.fillStyle = '#166534';
              ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
              ctx.fillStyle = '#22c55e';
              for (let i = 0; i < wall.width; i += 10) {
                  ctx.beginPath();
                  ctx.moveTo(wall.x + i, wall.y);
                  ctx.lineTo(wall.x + i + 5, wall.y - 10);
                  ctx.lineTo(wall.x + i + 10, wall.y);
                  ctx.fill();
              }
          } else {
              ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
              ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
              ctx.strokeStyle = '#a855f7';
              ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
          }
      });`
);

code = code.replace(
    `          } else if (proj.type === 'boomerang') {`,
    `          } else if (proj.type === 'thorn') {
              ctx.fillStyle = '#22c55e';
              ctx.beginPath();
              ctx.moveTo(proj.x, proj.y);
              ctx.lineTo(proj.x + (proj.vx > 0 ? 15 : -15), proj.y - 4);
              ctx.lineTo(proj.x + (proj.vx > 0 ? 15 : -15), proj.y + 4);
              ctx.fill();
          } else if (proj.type === 'boomerang') {`
);

code = code.replace(
    `        // Body
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Name tag (if me, show "You", else show ID prefix)`,
    `        let hideStandardBody = false;
        if (player.activeEffects?.['coleRoll'] && player.activeEffects['coleRoll'] > Date.now()) {
            hideStandardBody = true;
            ctx.save();
            ctx.translate(player.x + player.width/2, player.y + player.height/2);
            ctx.rotate(Date.now() / 50 * (player.facing === 'right' ? 1 : -1));
            ctx.fillStyle = player.color;
            ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
            ctx.restore();
        }

        if (!hideStandardBody) {
            // Body
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }

        // Name tag (if me, show "You", else show ID prefix)`
);

code = code.replace(
    `        } else {
            // Draw eyes to show facing direction
            ctx.fillStyle = 'black';
            if (player.facing === 'right') {
                ctx.fillRect(player.x + player.width - 15, player.y + 10, 5, 5);
            } else {
                ctx.fillRect(player.x + 10, player.y + 10, 5, 5);
            }
        }`,
    `        } else if (!hideStandardBody) {
            // Draw eyes to show facing direction
            ctx.fillStyle = 'black';
            if (player.facing === 'right') {
                ctx.fillRect(player.x + player.width - 15, player.y + 10, 5, 5);
            } else {
                ctx.fillRect(player.x + 10, player.y + 10, 5, 5);
            }
        }`
);

code = code.replace(
    `        if (player.activeEffects?.['healBuff'] && player.activeEffects['healBuff'] > Date.now()) {
            ctx.strokeStyle = '#22c55e';
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
            ctx.setLineDash([]);
        }

        ctx.globalAlpha = 1.0;`,
    `        if (player.activeEffects?.['healBuff'] && player.activeEffects['healBuff'] > Date.now()) {
            ctx.strokeStyle = '#22c55e';
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
            ctx.setLineDash([]);
        }

        if (player.activeEffects?.['brambleImmune'] && player.activeEffects['brambleImmune'] > Date.now()) {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.strokeRect(player.x - 4, player.y - 4, player.width + 8, player.height + 8);
            ctx.lineWidth = 1;
        }

        ctx.globalAlpha = 1.0;`
);

fs.writeFileSync('src/GameCanvas.tsx', code);
