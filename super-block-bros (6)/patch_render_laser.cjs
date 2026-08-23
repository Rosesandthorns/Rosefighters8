const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const targetEffect = `        if (data.effect === 'stab') {
            spawnSlamParticles(p.x + (p.facing === 'right' ? p.width : 0), p.y + p.height/2, '#dc2626');
        }`;
const replacementEffect = `        if (data.effect === 'stab') {
            spawnSlamParticles(p.x + (p.facing === 'right' ? p.width : 0), p.y + p.height/2, '#dc2626');
        }
        if (data.effect === 'nexusMelee') {
            p.activeEffects['nexusMelee'] = Date.now() + 200;
        }`;

if (code.includes(targetEffect)) {
    code = code.replace(targetEffect, replacementEffect);
    console.log("Patched effect render");
}

const targetProj = `          } else if (proj.type === 'thorn') {`;
const replacementProj = `          } else if (proj.type === 'laser') {
              ctx.fillStyle = '#f97316';
              ctx.fillRect(proj.x - 15, proj.y - 3, 30, 6);
          } else if (proj.type === 'thorn') {`;

if (code.includes(targetProj)) {
    code = code.replace(targetProj, replacementProj);
    console.log("Patched proj render");
}

fs.writeFileSync('src/GameCanvas.tsx', code);
