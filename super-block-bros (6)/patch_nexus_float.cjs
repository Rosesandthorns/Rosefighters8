const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `      if (myPlayer.characterId === 'pip') {
          const platformTop = PLATFORMS[0].y;
          if (myPlayer.y > platformTop - myPlayer.height) {
              myPlayer.y = platformTop - myPlayer.height;
              myPlayer.velocity.y = 0;
              myPlayer.isGrounded = true;
              myPlayer.isFastFalling = false;
          }
      }`;
const replacement = `      if (myPlayer.characterId === 'pip' || myPlayer.characterId === 'nexus') {
          const platformTop = PLATFORMS[0].y;
          const floatOffset = myPlayer.characterId === 'nexus' ? 10 : 0;
          if (myPlayer.y > platformTop - myPlayer.height - floatOffset) {
              myPlayer.y = platformTop - myPlayer.height - floatOffset;
              myPlayer.velocity.y = 0;
              myPlayer.isGrounded = true;
              myPlayer.isFastFalling = false;
          }
      }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched Nexus float");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
