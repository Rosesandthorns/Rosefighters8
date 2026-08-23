const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const targetUI = `                  <div className="flex justify-between items-end mb-1">
                    <span className={\`text-xs uppercase tracking-tighter font-bold \${textMutedClass}\`}>{name}</span>
                    <div className="flex gap-1">
                      {/* Health indicated by dots or just static aesthetic dots? We can show lives or score here */}
                      <span className={\`text-[10px] uppercase tracking-widest \${textMutedClass}\`}>Kills: {p.score}</span>
                    </div>
                  </div>`;
                  
const replaceUI = `                  <div className="flex justify-between items-end mb-1">
                    <div className="flex flex-col">
                      <span className={\`text-[10px] uppercase tracking-widest \${textMutedClass}\`}>{name}</span>
                      <span className="text-sm font-bold uppercase tracking-tighter text-white">
                        Playing as {ROSTER.find(c => c.id === p.characterId)?.name || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <span className={\`text-[10px] uppercase tracking-widest \${textMutedClass}\`}>Kills: {p.score}</span>
                    </div>
                  </div>`;

if (code.includes(targetUI)) {
    code = code.replace(targetUI, replaceUI);
    console.log("Patched Player UI");
} else {
    console.log("Could not find target UI");
}

fs.writeFileSync('src/GameCanvas.tsx', code);
