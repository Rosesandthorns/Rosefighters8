const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const target = `      (Object.values(entitiesRef.current.drones) as Drone[]).forEach(drone => {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(drone.x, drone.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.stroke();
          ctx.fillStyle = '#000';
          ctx.fillRect(drone.x + (drone.vx > 0 ? 3 : -5), drone.y - 2, 2, 2);
      });`;
const replacement = `      (Object.values(entitiesRef.current.drones) as Drone[]).forEach(drone => {
          const isA = drone.type === 'A';
          const isB = drone.type === 'B';
          const isC = drone.type === 'C';
          const radius = isA ? 5 : (isB ? 8 : (isC ? 10 : 10));
          ctx.fillStyle = isA ? '#60a5fa' : (isB ? '#f87171' : (isC ? '#facc15' : '#ef4444'));
          ctx.beginPath();
          ctx.arc(drone.x, drone.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.stroke();
          if (!isC) {
              ctx.fillStyle = '#000';
              ctx.fillRect(drone.x + (drone.vx > 0 ? 3 : -5), drone.y - 2, 2, 2);
          }
      });`;
if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("Patched Render Canvas");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
