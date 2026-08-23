const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
    `            facing: 'right', velocity: {x: 0, y: 0},
            isGrounded: false, isGrabbingLedge: false, score: 0, speedMult: char?.speedMult || 1.0`,
    `            facing: 'right', velocity: {x: 0, y: 0},
            isGrounded: false, isGrabbingLedge: false, score: 0, speedMult: char?.speedMult || 1.0,
            isAttacking: false, isStunned: false, isFastFalling: false`
);

fs.writeFileSync('server.ts', code);
