const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

code = code.replace(
`      (Object.values(entitiesRef.current.walls) as Wall[]).forEach(wall => {
          ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
          ctx.strokeStyle = '#a855f7';
          ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
      });`,
`      (Object.values(entitiesRef.current.walls) as Wall[]).forEach(wall => {
          if (wall.type === 'fire') {
              ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
              ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
              ctx.strokeStyle = '#f97316';
              ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
          } else {
              ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
              ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
              ctx.strokeStyle = '#a855f7';
              ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
          }
      });`
);

code = code.replace(
`      (Object.values(entitiesRef.current.projectiles) as Projectile[]).forEach(proj => {
          if (proj.type === 'card') {
              ctx.fillStyle = '#fff';
              ctx.fillRect(proj.x, proj.y - 5, 20, 15);
              ctx.strokeStyle = '#a855f7';
              ctx.strokeRect(proj.x, proj.y - 5, 20, 15);
          }
      });`,
`      (Object.values(entitiesRef.current.projectiles) as Projectile[]).forEach(proj => {
          if (proj.type === 'card') {
              ctx.fillStyle = '#fff';
              ctx.fillRect(proj.x, proj.y - 5, 20, 15);
              ctx.strokeStyle = '#a855f7';
              ctx.strokeRect(proj.x, proj.y - 5, 20, 15);
          } else if (proj.type === 'plate') {
              ctx.fillStyle = '#ccc';
              ctx.beginPath();
              ctx.ellipse(proj.x + 10, proj.y, 15, 5, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#fff';
              ctx.stroke();
          } else if (proj.type === 'fireball') {
              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(proj.x + 10, proj.y, 12, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#f97316';
              ctx.beginPath();
              ctx.arc(proj.x + 10, proj.y, 6, 0, Math.PI * 2);
              ctx.fill();
          } else if (proj.type === 'boomerang') {
              ctx.save();
              ctx.translate(proj.x + 15, proj.y + 15);
              ctx.rotate(Date.now() / 100);
              ctx.fillStyle = '#fff';
              ctx.beginPath();
              ctx.moveTo(-15, -15);
              ctx.lineTo(15, 0);
              ctx.lineTo(-15, 15);
              ctx.lineTo(-5, 0);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
          }
      });`
);

code = code.replace(
`        if (player.activeEffects?.['ricaGrabbed'] && player.activeEffects['ricaGrabbed'] > Date.now()) {`,
`        if (player.activeEffects?.['wombo'] && player.activeEffects['wombo'] > Date.now()) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(player.x + player.width/2, player.y + player.height/2, 80, 0, Math.PI * 2);
            ctx.stroke();
        }
        if (player.activeEffects?.['ricaGrabbed'] && player.activeEffects['ricaGrabbed'] > Date.now()) {`
);

fs.writeFileSync('src/GameCanvas.tsx', code);
