const fs = require('fs');

function addNexus(file, isServer) {
    let code = fs.readFileSync(file, 'utf8');
    const target = `  { id: 'pip', name: 'Pip', color: '#991b1b', hp: 30, ${isServer ? 'speedMult: 3.0, ' : ''}category: 'Rose Valley' }`;
    const replacement = `  { id: 'pip', name: 'Pip', color: '#991b1b', hp: 30, ${isServer ? 'speedMult: 3.0, ' : ''}category: 'Rose Valley' },
  { id: 'nexus', name: 'Nexus', color: '#f97316', hp: 40, ${isServer ? 'speedMult: 3.0, ' : ''}category: 'Rose Valley' }`;
    
    if (code.includes(target)) {
        code = code.replace(target, replacement);
        fs.writeFileSync(file, code);
        console.log("Patched roster in " + file);
    } else {
        console.log("Could not find roster target in " + file);
    }
}

addNexus('server.ts', true);
addNexus('src/GameCanvas.tsx', false);
