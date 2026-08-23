const fs = require('fs');
const file = 'src/GameCanvas.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `                      if (!hasGround) {
                          if (isColeRollActive) myPlayer.activeEffects['coleRoll'] = 0;
                          if (isRicaRunActive) myPlayer.activeEffects['ricaRun'] = 0;
                          moveTarget = 0;
                      }`;
                      
const replacement = `                      if (!hasGround) {
                          if (isColeRollActive) myPlayer.activeEffects['coleRoll'] = 0;
                          if (isRicaRunActive) myPlayer.activeEffects['ricaRun'] = 0;
                          myPlayer.activeEffects['edgeBrake'] = Date.now() + 150;
                          moveTarget = 0;
                      }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Replaced edge detection correctly!");
} else {
    console.log("Could not find edge detection target.");
}

const target2 = `              } else if (myPlayer.activeEffects?.['ricaCharge'] && myPlayer.activeEffects['ricaCharge'] > Date.now()) {
                  moveTarget = 0; // frozen while charging
              } else {
                  if (keys['ArrowLeft'] || keys['KeyA']) {`;
                  
const replacement2 = `              } else if (myPlayer.activeEffects?.['ricaCharge'] && myPlayer.activeEffects['ricaCharge'] > Date.now()) {
                  moveTarget = 0; // frozen while charging
              } else if (myPlayer.activeEffects?.['edgeBrake'] && myPlayer.activeEffects['edgeBrake'] > Date.now()) {
                  moveTarget = 0; // frozen to prevent accidentally walking off edge
              } else {
                  if (keys['ArrowLeft'] || keys['KeyA']) {`;

if (code.includes(target2)) {
    code = code.replace(target2, replacement2);
    console.log("Replaced edge brake block correctly!");
} else {
    console.log("Could not find edge brake target.");
}

fs.writeFileSync(file, code);
