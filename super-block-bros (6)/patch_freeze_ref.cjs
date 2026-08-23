const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `  const hitCooldownsRef = useRef<Record<string, number>>({}); // prevent multi-hits per attack`;
const replacement = `  const hitCooldownsRef = useRef<Record<string, number>>({}); // prevent multi-hits per attack
  const freezeEndTimeRef = useRef<number>(0);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched freeze ref");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
