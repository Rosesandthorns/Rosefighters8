const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

code = code.replace(
    `const ROSTER = [
  { id: 'mirage', name: 'Mirage', color: '#a855f7', hp: 80 },
  { id: 'orbo', name: 'Orbo', color: '#06b6d4', hp: 60 },
  { id: 'rica', name: 'Rica', color: '#ef4444', hp: 120 },
  { id: 'chester', name: 'Chester', color: '#8b4513', hp: 200 },
  { id: 'pinedo', name: 'Pinedo', color: '#ffffff', hp: 100 },
  { id: 'morka', name: 'Morka', color: '#6b7280', hp: 120 },
  { id: 'wisp', name: 'Wisp', color: '#3b82f6', hp: 50 },
  { id: 'cole', name: 'Cole', color: '#4b5563', hp: 150 },
  { id: 'oakwell', name: 'Oakwell', color: '#92400e', hp: 100 }
];`,
    `const ROSTER = [
  { id: 'mirage', name: 'Mirage', color: '#a855f7', hp: 80, category: 'Mirage Park' },
  { id: 'orbo', name: 'Orbo', color: '#06b6d4', hp: 60, category: 'Mirage Park' },
  { id: 'rica', name: 'Rica', color: '#ef4444', hp: 120, category: 'Mirage Park' },
  { id: 'chester', name: 'Chester', color: '#8b4513', hp: 200, category: 'Mirage Park' },
  { id: 'pinedo', name: 'Pinedo', color: '#ffffff', hp: 100, category: 'Mirage Park' },
  { id: 'morka', name: 'Morka', color: '#6b7280', hp: 120, category: 'Mirage Park' },
  { id: 'wisp', name: 'Wisp', color: '#3b82f6', hp: 50, category: 'Mirage Park' },
  { id: 'cole', name: 'Cole', color: '#4b5563', hp: 150, category: 'Mirage Park' },
  { id: 'oakwell', name: 'Oakwell', color: '#92400e', hp: 150, category: 'Mirage Park' },
  { id: 'pip', name: 'Pip', color: '#991b1b', hp: 30, category: 'Rose Valley' }
];`
);

code = code.replace(
    `          <div className="grid grid-cols-4 gap-6 mb-12">
            {ROSTER.map((char) => {
               const playersArray = Object.values(lobbyPlayers) as LobbyPlayer[];`,
    `          <div className="flex flex-col gap-12 mb-12">
            {[...new Set(ROSTER.map(c => c.category))].map(category => (
              <div key={category}>
                <h2 className="text-2xl font-bold italic text-white mb-6 border-b border-white/10 pb-2">{category}</h2>
                <div className="grid grid-cols-4 gap-6">
                  {ROSTER.filter(c => c.category === category).map((char) => {
                     const playersArray = Object.values(lobbyPlayers) as LobbyPlayer[];`
);

code = code.replace(
    `               )
            })}
          </div>

          <div className="flex justify-center mt-auto">`,
    `                 )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-auto">`
);

code = code.replace(
    `      // Side bounds (Blast zones)
      if (myPlayer.x < -200) myPlayer.x = -200;`,
    `      // Pip Hover mechanics
      if (myPlayer.characterId === 'pip') {
          const platformTop = PLATFORMS[0].y;
          if (myPlayer.y > platformTop - myPlayer.height) {
              myPlayer.y = platformTop - myPlayer.height;
              myPlayer.velocity.y = 0;
              myPlayer.isGrounded = true;
              myPlayer.isFastFalling = false;
          }
      }

      // Side bounds (Blast zones)
      if (myPlayer.x < -200) myPlayer.x = -200;`
);

code = code.replace(
    `        if (data.effect === 'brambleImmune') {
            p.activeEffects['brambleImmune'] = Date.now() + 3000;
        }`,
    `        if (data.effect === 'brambleImmune') {
            p.activeEffects['brambleImmune'] = Date.now() + 3000;
        }
        if (data.effect === 'stab') {
            spawnSlamParticles(p.x + (p.facing === 'right' ? p.width : 0), p.y + p.height/2, '#dc2626');
        }`
);

code = code.replace(
    `          } else if (wall.type === 'bramble') {`,
    `          } else if (wall.type === 'bloodCloud') {
              ctx.fillStyle = 'rgba(220, 38, 38, 0.4)';
              ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
              ctx.fillStyle = 'rgba(220, 38, 38, 0.8)';
              for(let i=0; i<wall.width; i+=15) {
                  ctx.fillRect(wall.x + i, wall.y, 4, wall.height * (0.3 + 0.7 * Math.sin(Date.now()/200 + i)));
              }
          } else if (wall.type === 'bramble') {`
);

fs.writeFileSync('src/GameCanvas.tsx', code);
