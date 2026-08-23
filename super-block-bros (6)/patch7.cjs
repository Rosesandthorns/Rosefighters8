const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `              if (myPlayer.activeEffects?.['coleRoll'] && myPlayer.activeEffects['coleRoll'] > Date.now()) {
                  moveTarget = myPlayer.facing === 'right' ? MOVE_SPEED * 2 : -MOVE_SPEED * 2;
              } else if (myPlayer.activeEffects?.['ricaRun'] && myPlayer.activeEffects['ricaRun'] > Date.now()) {
                  if (!myPlayer.isGrounded) {
                      myPlayer.activeEffects['ricaRun'] = 0; // stop charge if fell off edge
                  } else {
                      moveTarget = myPlayer.facing === 'right' ? currentSpeed * 2.5 : -currentSpeed * 2.5;
                      
                      const nextLeft = myPlayer.x + moveTarget;
                      const nextRight = myPlayer.x + myPlayer.width + moveTarget;
                      const checkX = myPlayer.facing === 'right' ? nextRight : nextLeft;
                      const checkY = myPlayer.y + myPlayer.height + 5;
                      
                      let hasGround = false;
                      for (const plat of PLATFORMS) {
                          if (checkX > plat.x && checkX < plat.x + plat.width && 
                              checkY >= plat.y && checkY <= plat.y + 20) {
                              hasGround = true; 
                              break;
                          }
                      }
                      
                      if (!hasGround) {
                          myPlayer.activeEffects['ricaRun'] = 0;
                          moveTarget = 0;
                      }
                  }
                  // Don't allow changing direction while running
              } else if (myPlayer.activeEffects?.['toothDash'] && myPlayer.activeEffects['toothDash'] > Date.now()) {`;

const replacement = `              const isColeRollActive = myPlayer.activeEffects?.['coleRoll'] && myPlayer.activeEffects['coleRoll'] > Date.now();
              const isRicaRunActive = myPlayer.activeEffects?.['ricaRun'] && myPlayer.activeEffects['ricaRun'] > Date.now();
              if (isColeRollActive || isRicaRunActive) {
                  if (!myPlayer.isGrounded) {
                      if (isColeRollActive) myPlayer.activeEffects['coleRoll'] = 0;
                      if (isRicaRunActive) myPlayer.activeEffects['ricaRun'] = 0;
                  } else {
                      moveTarget = myPlayer.facing === 'right' ? (isColeRollActive ? MOVE_SPEED * 2 : currentSpeed * 2.5) : (isColeRollActive ? -MOVE_SPEED * 2 : -currentSpeed * 2.5);
                      
                      const nextLeft = myPlayer.x + moveTarget;
                      const nextRight = myPlayer.x + myPlayer.width + moveTarget;
                      const checkX = myPlayer.facing === 'right' ? nextRight : nextLeft;
                      const checkY = myPlayer.y + myPlayer.height + 5;
                      
                      let hasGround = false;
                      for (const plat of PLATFORMS) {
                          if (checkX > plat.x && checkX < plat.x + plat.width && 
                              checkY >= plat.y && checkY <= plat.y + 20) {
                              hasGround = true; 
                              break;
                          }
                      }
                      
                      if (!hasGround) {
                          if (isColeRollActive) myPlayer.activeEffects['coleRoll'] = 0;
                          if (isRicaRunActive) myPlayer.activeEffects['ricaRun'] = 0;
                          moveTarget = 0;
                      }
                  }
              } else if (myPlayer.activeEffects?.['toothDash'] && myPlayer.activeEffects['toothDash'] > Date.now()) {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/GameCanvas.tsx', code);
    console.log("Replaced successfully!");
} else {
    console.log("Target not found!");
}
