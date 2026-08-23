const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/p\.health < 30/g, 'p.health <= 30');

fs.writeFileSync(file, code);
console.log("Patched executions");
