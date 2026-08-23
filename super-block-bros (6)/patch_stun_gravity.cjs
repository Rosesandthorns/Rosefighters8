const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `          // If stunned in air, apply gravity and terminal velocity but keep fast falling flag if it was set
          if (!myPlayer.isGrounded) {
              myPlayer.velocity.y += GRAVITY;
              if (myPlayer.velocity.y > MAX_FALL_SPEED) {
                  myPlayer.velocity.y = MAX_FALL_SPEED;
              }
          }
          // Air/ground friction
          myPlayer.velocity.x *= 0.95;`;
          
const replacement = `          const isGloballyFrozen = Date.now() < freezeEndTimeRef.current;
          if (isGloballyFrozen) {
              myPlayer.velocity.x = 0;
              myPlayer.velocity.y = 0;
          } else {
              // If stunned in air, apply gravity and terminal velocity but keep fast falling flag if it was set
              if (!myPlayer.isGrounded) {
                  myPlayer.velocity.y += GRAVITY;
                  if (myPlayer.velocity.y > MAX_FALL_SPEED) {
                      myPlayer.velocity.y = MAX_FALL_SPEED;
                  }
              }
              // Air/ground friction
              myPlayer.velocity.x *= 0.95;
          }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched freeze gravity");
} else {
    console.log("Could not find stun gravity target.");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
