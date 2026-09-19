import * as THREE from 'three';
import { mats, createBox, createCylinder } from './materials.js';

// Desk constant with center at (0, 0, -1.8)
export const DESK = {
  x: 0,
  z: -1.8,
  topY: 0.76,
  w: 2.4,
  d: 1.0,
};

// Geometry cache to avoid recomputation
const geometryCache = {
  deskTopGeom: null,
  drawerGeom: null,
  handleGeom: null,
  cylinderGeom: null,
};

function getOrCreateGeometry(key, createFunc) {
  if (!geometryCache[key]) {
    geometryCache[key] = createFunc();
  }
  return geometryCache[key];
}

export function addFurniture(scene) {
  // Create desk
  createDesk(scene);
  
  // Create desk items group (initially visible, can be hidden later)
  const deskItems = new THREE.Group();
  deskItems.name = 'deskItems';
  scene.add(deskItems);
  
  // Add desk items
  addDeskItems(deskItems);
  
  // Create executive chair
  createExecutiveChair(scene);
  
  // Create guest chairs
  createGuestChair(scene, 0.9);   // Right guest chair
  createGuestChair(scene, -0.9);  // Left guest chair
}

function createDesk(scene) {
  const deskGroup = new THREE.Group();
  deskGroup.position.set(DESK.x, 0, DESK.z);
  scene.add(deskGroup);
  
  // Desk base (walnut wood)
  const baseHeight = DESK.topY - 0.05; // Glass top thickness
  const baseGeom = new THREE.BoxGeometry(DESK.w, baseHeight, DESK.d);
  const baseMesh = new THREE.Mesh(baseGeom, mats.walnut);
  baseMesh.position.y = baseHeight / 2;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  deskGroup.add(baseMesh);
  
  // Glass top (dark, thick 5cm = 0.05m)
  const topGeom = new THREE.BoxGeometry(DESK.w, 0.05, DESK.d);
  const topMesh = new THREE.Mesh(topGeom, mats.deskTop);
  topMesh.position.y = DESK.topY - 0.025;
  topMesh.castShadow = true;
  topMesh.receiveShadow = true;
  deskGroup.add(topMesh);
  
  // Left drawer unit (3 drawers, chrome handles on -z side)
  createDrawerUnit(deskGroup, -DESK.w / 2 + 0.2, 0.3, -1);
  
  // Right drawer unit (3 drawers, chrome handles on -z side)
  createDrawerUnit(deskGroup, DESK.w / 2 - 0.2, 0.3, 1);
  
  // Front privacy panel
  const panelGeom = new THREE.BoxGeometry(DESK.w + 0.1, 0.3, 0.05);
  const panelMesh = new THREE.Mesh(panelGeom, mats.blackMetal);
  panelMesh.position.y = 0.15;
  panelMesh.position.z = DESK.d / 2 + 0.05;
  panelMesh.castShadow = true;
  deskGroup.add(panelMesh);
  
  // Neon strip under front edge (warm orange)
  const neonGeom = new THREE.BoxGeometry(DESK.w + 0.1, 0.02, 0.08);
  const neonMesh = new THREE.Mesh(neonGeom, mats.neonWarm);
  neonMesh.position.y = 0.01;
  neonMesh.position.z = DESK.d / 2 + 0.1;
  deskGroup.add(neonMesh);
  
  // Point light under neon (warm, illuminating floor)
  const neonLight = new THREE.PointLight(0xffa500, 1.5, 3);
  neonLight.position.set(0, 0.2, DESK.d / 2 + 0.15);
  neonLight.castShadow = true;
  deskGroup.add(neonLight);
}

function createDrawerUnit(parent, xOffset, yPos, side) {
  const unitGroup = new THREE.Group();
  unitGroup.position.x = xOffset;
  parent.add(unitGroup);
  
  const drawerWidth = 0.35;
  const drawerHeight = 0.2;
  const drawerDepth = 0.5;
  
  for (let i = 0; i < 3; i++) {
    const yDrawer = yPos + i * drawerHeight;
    
    // Drawer body
    const drawerGeom = new THREE.BoxGeometry(drawerWidth, drawerHeight - 0.02, drawerDepth);
    const drawerMesh = new THREE.Mesh(drawerGeom, mats.walnut);
    drawerMesh.position.set(0, yDrawer + drawerHeight / 2, 0);
    drawerMesh.castShadow = true;
    drawerMesh.receiveShadow = true;
    unitGroup.add(drawerMesh);
    
    // Chrome handle on -z side
    const handleGeom = new THREE.BoxGeometry(0.15, 0.015, 0.02);
    const handleMesh = new THREE.Mesh(handleGeom, mats.chrome);
    handleMesh.position.set(0, yDrawer + drawerHeight / 2, -drawerDepth / 2 - 0.01);
    handleMesh.castShadow = true;
    unitGroup.add(handleMesh);
  }
}

function addDeskItems(group) {
  // Monitor on arm facing -z (toward executive chair)
  const screenGeom = new THREE.BoxGeometry(0.5, 0.3, 0.05);
  const screenMesh = new THREE.Mesh(screenGeom, mats.screen);
  screenMesh.position.set(-0.4, 0.95, -0.3);
  screenMesh.castShadow = true;
  group.add(screenMesh);
  
  // Monitor arm (thin cylinder)
  const armGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8);
  const armMesh = new THREE.Mesh(armGeom, mats.chrome);
  armMesh.position.set(-0.4, 0.85, -0.15);
  armMesh.castShadow = true;
  group.add(armMesh);
  
  // Keyboard on -z side
  const keyboardGeom = new THREE.BoxGeometry(0.4, 0.02, 0.15);
  const keyboardMesh = new THREE.Mesh(keyboardGeom, mats.blackMetal);
  keyboardMesh.position.set(-0.3, 0.77, -0.3);
  keyboardMesh.castShadow = true;
  group.add(keyboardMesh);
  
  // Mouse on -z side
  const mouseGeom = new THREE.BoxGeometry(0.06, 0.03, 0.1);
  const mouseMesh = new THREE.Mesh(mouseGeom, mats.blackMetal);
  mouseMesh.position.set(0.15, 0.77, -0.35);
  mouseMesh.castShadow = true;
  group.add(mouseMesh);
  
  // Desk lamp with angled arm and warm neon ring
  // Lamp base
  const lampBaseGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16);
  const lampBaseMesh = new THREE.Mesh(lampBaseGeom, mats.chrome);
  lampBaseMesh.position.set(0.6, 0.77, 0.2);
  lampBaseMesh.castShadow = true;
  group.add(lampBaseMesh);
  
  // Lamp arm (angled cylinder)
  const lampArmGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.35, 8);
  const lampArmMesh = new THREE.Mesh(lampArmGeom, mats.chrome);
  lampArmMesh.position.set(0.6, 0.95, 0.2);
  lampArmMesh.rotation.z = Math.PI / 6;
  lampArmMesh.castShadow = true;
  group.add(lampArmMesh);
  
  // Neon ring at lamp head (torus - warm orange)
  const ringGeom = new THREE.TorusGeometry(0.08, 0.01, 8, 16);
  const ringMesh = new THREE.Mesh(ringGeom, mats.neonWarm);
  ringMesh.position.set(0.78, 1.15, 0.35);
  ringMesh.rotation.x = Math.PI / 2;
  group.add(ringMesh);
  
  // Warm light from lamp
  const lampLight = new THREE.PointLight(0xffa500, 1, 2);
  lampLight.position.set(0.78, 1.15, 0.35);
  lampLight.castShadow = true;
  group.add(lampLight);
  
  // Small leather notebook
  const notebookGeom = new THREE.BoxGeometry(0.15, 0.01, 0.2);
  const notebookMesh = new THREE.Mesh(notebookGeom, mats.leather);
  notebookMesh.position.set(0.4, 0.78, 0.15);
  notebookMesh.castShadow = true;
  group.add(notebookMesh);
}

function createExecutiveChair(scene) {
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0.1, 0, -2.75);
  scene.add(chairGroup);
  
  // Chair base with 5 wheels and chrome
  const baseGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 8);
  const baseMesh = new THREE.Mesh(baseGeom, mats.chrome);
  baseMesh.position.y = 0.025;
  baseMesh.castShadow = true;
  chairGroup.add(baseMesh);
  
  // Wheels (5 chrome wheels around base)
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const wheelX = Math.cos(angle) * 0.35;
    const wheelZ = Math.sin(angle) * 0.35;
    
    const wheelGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 8);
    const wheelMesh = new THREE.Mesh(wheelGeom, mats.chrome);
    wheelMesh.position.set(wheelX, 0.06, wheelZ);
    wheelMesh.rotation.z = Math.PI / 2;
    wheelMesh.castShadow = true;
    chairGroup.add(wheelMesh);
  }
  
  // Gas lift (cylinder)
  const gasLiftGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
  const gasLiftMesh = new THREE.Mesh(gasLiftGeom, mats.blackMetal);
  gasLiftMesh.position.y = 0.2;
  gasLiftMesh.castShadow = true;
  chairGroup.add(gasLiftMesh);
  
  // Seat (leather with stitching)
  const seatGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
  const seatMesh = new THREE.Mesh(seatGeom, mats.leatherStitch);
  seatMesh.position.y = 0.42;
  seatMesh.castShadow = true;
  chairGroup.add(seatMesh);
  
  // Backrest (tall, slightly reclined with headrest)
  const backrestGeom = new THREE.BoxGeometry(0.4, 0.65, 0.1);
  const backrestMesh = new THREE.Mesh(backrestGeom, mats.leatherStitch);
  backrestMesh.position.y = 0.85;
  backrestMesh.position.z = 0.05;
  backrestMesh.rotation.z = -Math.PI / 12; // Slight recline
  backrestMesh.castShadow = true;
  chairGroup.add(backrestMesh);
  
  // Headrest (small chrome cylinder)
  const headrestGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8);
  const headrestMesh = new THREE.Mesh(headrestGeom, mats.chrome);
  headrestMesh.position.y = 1.45;
  headrestMesh.position.z = 0.08;
  headrestMesh.castShadow = true;
  chairGroup.add(headrestMesh);
  
  // Backrest support column (chrome)
  const columnGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.65, 8);
  const columnMesh = new THREE.Mesh(columnGeom, mats.chrome);
  columnMesh.position.y = 0.8;
  columnMesh.position.z = 0.08;
  columnMesh.castShadow = true;
  chairGroup.add(columnMesh);
  
  // Armrests (left and right)
  for (let side of [-1, 1]) {
    const armrestGeom = new THREE.BoxGeometry(0.08, 0.15, 0.25);
    const armrestMesh = new THREE.Mesh(armrestGeom, mats.leather);
    armrestMesh.position.x = side * 0.25;
    armrestMesh.position.y = 0.55;
    armrestMesh.position.z = -0.05;
    armrestMesh.castShadow = true;
    chairGroup.add(armrestMesh);
  }
}

function createGuestChair(scene, xPos) {
  const chairGroup = new THREE.Group();
  chairGroup.position.set(xPos, 0, -0.75);
  scene.add(chairGroup);
  
  // Chrome sled base with thin cylinders (cantilever)
  const baseGeom = new THREE.BoxGeometry(0.4, 0.05, 0.45);
  const baseMesh = new THREE.Mesh(baseGeom, mats.chrome);
  baseMesh.position.y = 0.025;
  baseMesh.castShadow = true;
  chairGroup.add(baseMesh);
  
  // Front legs (thin chrome cylinders)
  for (let side of [-1, 1]) {
    const legGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);
    const legMesh = new THREE.Mesh(legGeom, mats.chrome);
    legMesh.position.x = side * 0.15;
    legMesh.position.y = 0.2;
    legMesh.position.z = 0.15;
    legMesh.castShadow = true;
    chairGroup.add(legMesh);
  }
  
  // Back legs (thin chrome cylinders)
  for (let side of [-1, 1]) {
    const legGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);
    const legMesh = new THREE.Mesh(legGeom, mats.chrome);
    legMesh.position.x = side * 0.15;
    legMesh.position.y = 0.2;
    legMesh.position.z = -0.15;
    legMesh.castShadow = true;
    chairGroup.add(legMesh);
  }
  
  // Seat (dark blue fabric)
  const seatGeom = new THREE.BoxGeometry(0.35, 0.08, 0.4);
  const seatMesh = new THREE.Mesh(seatGeom, mats.fabric);
  seatMesh.position.y = 0.45;
  seatMesh.castShadow = true;
  chairGroup.add(seatMesh);
  
  // Backrest (dark blue fabric)
  const backGeom = new THREE.BoxGeometry(0.35, 0.35, 0.08);
  const backMesh = new THREE.Mesh(backGeom, mats.fabric);
  backMesh.position.y = 0.75;
  backMesh.position.z = -0.18;
  backMesh.castShadow = true;
  chairGroup.add(backMesh);
}
