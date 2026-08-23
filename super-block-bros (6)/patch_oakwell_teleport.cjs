const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `          } else if (data.ability === 3) {
              const grounded = Object.values(players).filter(p => p.id !== player.id && p.isGrounded);
              if (grounded.length > 0) {
                  const target = grounded[Math.floor(Math.random() * grounded.length)];`;
const replacement = `          } else if (data.ability === 3) {
              if (!player.isGrounded) return;
              const grounded = Object.values(players).filter(p => p.id !== player.id && p.isGrounded);
              if (grounded.length > 0) {
                  const target = grounded[Math.floor(Math.random() * grounded.length)];`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched Oakwell Teleport Server");
}
fs.writeFileSync('server.ts', code);
