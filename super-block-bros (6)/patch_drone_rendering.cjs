const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const targetIf = `interface Drone {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ownerId: string;
  hp: number;
}`;
const replaceIf = `interface Drone {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ownerId: string;
  hp: number;
  type?: 'A' | 'B' | 'C';
  angle?: number;
}`;

if (code.includes(targetIf)) {
    code = code.replace(targetIf, replaceIf);
    console.log("Patched Drone Interface Canvas");
}

const targetRender = `      (Object.values(entitiesRef.current.drones) as Drone[]).forEach(drone => {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(drone.x, drone.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
      });`;
      
const replaceRender = `      (Object.values(entitiesRef.current.drones) as Drone[]).forEach(drone => {
          const isA = drone.type === 'A';
          const isB = drone.type === 'B';
          const isC = drone.type === 'C';
          const radius = isA ? 5 : (isB ? 8 : (isC ? 10 : 10));
          ctx.fillStyle = isA ? '#60a5fa' : (isB ? '#f87171' : (isC ? '#facc15' : '#ef4444'));
          ctx.beginPath();
          ctx.arc(drone.x, drone.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
      });`;

if (code.includes(targetRender)) {
    code = code.replace(targetRender, replaceRender);
    console.log("Patched Drone Rendering Canvas");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
