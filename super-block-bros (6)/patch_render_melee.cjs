const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `        if (player.isAttacking) {`;
const replacement = `        if (player.activeEffects?.['nexusMelee'] && player.activeEffects['nexusMelee'] > Date.now()) {
             ctx.fillStyle = '#f97316';
             const range = 60;
             if (player.facing === 'right') {
                 ctx.fillRect(player.x + player.width, player.y + 10, range, 20);
             } else {
                 ctx.fillRect(player.x - range, player.y + 10, range, 20);
             }
        }
        if (player.isAttacking) {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched melee render");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
