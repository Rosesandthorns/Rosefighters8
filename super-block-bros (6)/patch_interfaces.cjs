const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetPlayer = `  isFastFalling: boolean;
  score: number;
  speedMult?: number;`;
  
const replacePlayer = `  isFastFalling: boolean;
  score: number;
  speedMult?: number;
  staticChargeLastHit?: number;`;

if (code.includes(targetPlayer)) {
    code = code.replace(targetPlayer, replacePlayer);
    console.log("Patched Player interface");
}

const targetProj = `    type: 'card' | 'boomerang' | 'fireball' | 'plate' | 'thorn';
    x: number;
    y: number;
    vx: number;
    vy: number;`;
    
const replaceProj = `    type: 'card' | 'boomerang' | 'fireball' | 'plate' | 'thorn' | 'laser';
    x: number;
    y: number;
    startX?: number;
    startY?: number;
    vx: number;
    vy: number;`;

if (code.includes(targetProj)) {
    code = code.replace(targetProj, replaceProj);
    console.log("Patched Projectile interface");
}

fs.writeFileSync('server.ts', code);
