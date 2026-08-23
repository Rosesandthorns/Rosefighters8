const fs = require('fs');
const file = 'src/GameCanvas.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `                      if (!hasGround) {
                          if (isColeRollActive) myPlayer.activeEffects['coleRoll'] = 0;
                          if (isRicaRunActive) myPlayer.activeEffects['ricaRun'] = 0;
                          myPlayer.activeEffects['edgeBrake'] = Date.now() + 150;
                          moveTarget = 0;
                      }`;
                      
const replacement = `                      if (!hasGround) {
                          if (isColeRollActive) myPlayer.activeEffects['coleRoll'] = 0;
                          if (isRicaRunActive) myPlayer.activeEffects['ricaRun'] = 0;
                          myPlayer.activeEffects['edgeBrake'] = Date.now() + 150;
                          moveTarget = 0;
                          myPlayer.velocity.x = 0;
                      }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Replaced edge velocity correctly!");
} else {
    console.log("Could not find edge velocity target.");
}
fs.writeFileSync(file, code);
