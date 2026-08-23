const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `                    const beforeHp = player.health;
                    applyDamage(player, proj.damage, proj.ownerId);`;
                    
const replacement = `                    const beforeHp = player.health;
                    let actualDamage = proj.damage;
                    if (proj.type === 'laser') {
                        const dist = Math.hypot(proj.x - (proj.startX || 0), proj.y - (proj.startY || 0));
                        actualDamage = Math.min(40, Math.max(10, 10 + (dist / 800) * 30));
                    }
                    applyDamage(player, actualDamage, proj.ownerId);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched projectile collision");
}
fs.writeFileSync('server.ts', code);
