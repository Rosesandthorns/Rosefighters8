const fs = require('fs');
let code = fs.readFileSync('src/GameCanvas.tsx', 'utf8');

const targetDrone = `interface Drone {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    ownerId: string;
    hp: number;
}`;
const replaceDrone = `interface Drone {
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
if (code.includes(targetDrone)) {
    code = code.replace(targetDrone, replaceDrone);
    console.log("Patched Drone Canvas");
}

const targetRoster = `  { id: 'pip', name: 'Pip', color: '#991b1b', hp: 30, category: 'Rose Valley' },
  { id: 'nexus', name: 'Nexus', color: '#f97316', hp: 40, category: 'Rose Valley' }
];`;
const replaceRoster = `  { id: 'pip', name: 'Pip', color: '#991b1b', hp: 30, category: 'Rose Valley' },
  { id: 'nexus', name: 'Nexus', color: '#f97316', hp: 40, category: 'Rose Valley' },
  { id: 'neddy', name: 'Neddy', color: '#eab308', hp: 80, category: 'Project Defence' }
];`;
if (code.includes(targetRoster)) {
    code = code.replace(targetRoster, replaceRoster);
    console.log("Patched Roster Canvas");
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
    console.log("Patched Render Canvas");
}
fs.writeFileSync('src/GameCanvas.tsx', code);
