const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// ROSTER
const targetRoster = `  { id: 'pip', name: 'Pip', color: '#991b1b', hp: 30, speedMult: 3.0, category: 'Rose Valley' },
  { id: 'nexus', name: 'Nexus', color: '#f97316', hp: 40, speedMult: 3.0, category: 'Rose Valley' }
];`;
const replaceRoster = `  { id: 'pip', name: 'Pip', color: '#991b1b', hp: 30, speedMult: 3.0, category: 'Rose Valley' },
  { id: 'nexus', name: 'Nexus', color: '#f97316', hp: 40, speedMult: 3.0, category: 'Rose Valley' },
  { id: 'neddy', name: 'Neddy', color: '#eab308', hp: 80, speedMult: 1.2, category: 'Project Defence' }
];`;
if (code.includes(targetRoster)) {
    code = code.replace(targetRoster, replaceRoster);
    console.log("Patched Roster Server");
}

// Player interface
const targetPlayer = `  score: number;
  speedMult: number;
  staticChargeLastHit?: number;`;
const replacePlayer = `  score: number;
  speedMult: number;
  staticChargeLastHit?: number;
  hadDronesA?: boolean;
  hadDronesB?: boolean;
  hadDronesC?: boolean;
  droneACooldown?: number;
  droneBCooldown?: number;
  droneCCooldown?: number;`;
if (code.includes(targetPlayer)) {
    code = code.replace(targetPlayer, replacePlayer);
    console.log("Patched Player Interface Server");
}

// Drone interface
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
    console.log("Patched Drone Interface Server");
}

fs.writeFileSync('server.ts', code);
