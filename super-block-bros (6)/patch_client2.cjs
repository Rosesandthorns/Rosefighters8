const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

code = code.replace(
`        if (data.effect === 'healStart') {
            p.activeEffects['heal'] = Date.now() + 5000;
        }`,
`        if (data.effect === 'healStart') {
            p.activeEffects['heal'] = Date.now() + 5000;
        }
        if (data.effect === 'headSmash') {
            spawnSlamParticles(p.x + p.width/2, p.y + p.height/2, '#ffffff');
        }
        if (data.effect === 'womboStart') {
            p.activeEffects['wombo'] = Date.now() + 5000;
        }
        if (data.effect === 'morkaGrab') {
            p.activeEffects['ricaGrabbed'] = Date.now() + 2000;
        }`
);

fs.writeFileSync('src/GameCanvas.tsx', code);
