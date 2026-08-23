const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `  useEffect(() => {
    if (!socket) return;`;

const replacement = `  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (appState === 'PLAYING') {
      audio = new Audio('/rival_theme.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [appState]);

  useEffect(() => {
    if (!socket) return;`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched audio");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
