const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `    newSocket.on('clearStun', () => {`;
const replacement = `    newSocket.on('globalFreeze', (data: { endTime: number }) => {
        freezeEndTimeRef.current = data.endTime;
    });

    newSocket.on('clearStun', () => {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched freeze listener");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
