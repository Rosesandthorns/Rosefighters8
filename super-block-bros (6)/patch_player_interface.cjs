const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetPlayer = `  score: number;
  speedMult: number;`;
  
const replacePlayer = `  score: number;
  speedMult: number;
  staticChargeLastHit?: number;`;

if (code.includes(targetPlayer)) {
    code = code.replace(targetPlayer, replacePlayer);
    console.log("Patched Player interface");
}
fs.writeFileSync('server.ts', code);
