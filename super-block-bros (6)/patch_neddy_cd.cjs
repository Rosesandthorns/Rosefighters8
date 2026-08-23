const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `          // Abilities
          const isOakwell = myPlayer.characterId === 'oakwell';
          if (mouseButtons[0] && abilityCooldownsRef.current[1] === 0 && !myPlayer.isGrabbingLedge) {
              socket.emit('useAbility', { ability: 1 });
              abilityCooldownsRef.current[1] = isOakwell ? 15 : 60; // 0.5s for Oakwell
              hitCooldownsRef.current = {}; // reset hitbox hits for dash/run/etc
          } else if (mouseButtons[1] && abilityCooldownsRef.current[2] === 0 && !myPlayer.isGrabbingLedge) {
              socket.emit('useAbility', { ability: 2 });
              abilityCooldownsRef.current[2] = 300; // 5s cooldown
              hitCooldownsRef.current = {};
          } else if (mouseButtons[2] && abilityCooldownsRef.current[3] === 0 && !myPlayer.isGrabbingLedge) {
              socket.emit('useAbility', { ability: 3 });
              abilityCooldownsRef.current[3] = 300; // 5s cooldown
              hitCooldownsRef.current = {};
          }`;
          
const replacement = `          // Abilities
          const isOakwell = myPlayer.characterId === 'oakwell';
          const isNeddy = myPlayer.characterId === 'neddy';
          if (mouseButtons[0] && abilityCooldownsRef.current[1] === 0 && !myPlayer.isGrabbingLedge) {
              socket.emit('useAbility', { ability: 1 });
              abilityCooldownsRef.current[1] = isNeddy ? 15 : (isOakwell ? 15 : 60);
              hitCooldownsRef.current = {};
          } else if (mouseButtons[1] && abilityCooldownsRef.current[2] === 0 && !myPlayer.isGrabbingLedge) {
              socket.emit('useAbility', { ability: 2 });
              abilityCooldownsRef.current[2] = isNeddy ? 15 : 300;
              hitCooldownsRef.current = {};
          } else if (mouseButtons[2] && abilityCooldownsRef.current[3] === 0 && !myPlayer.isGrabbingLedge) {
              socket.emit('useAbility', { ability: 3 });
              abilityCooldownsRef.current[3] = isNeddy ? 15 : 300;
              hitCooldownsRef.current = {};
          }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched Neddy Cooldowns Canvas");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
