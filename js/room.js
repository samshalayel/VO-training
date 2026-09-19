import * as THREE from 'three';
import { mats, createPlane, createBox, createCylinder, createSingleSidedPlane } from './materials.js';

// Room dimensions
const ROOM_WIDTH = 10;
const ROOM_DEPTH = 8;
const ROOM_HEIGHT = 3.2;
const FRAME_HEIGHT = 0.12; // Bottom frame 12cm
const CORNICE_HEIGHT = 0.08; // Top cornice 8cm

export function createRoom(scene) {
  // Floor (10×8 at y=0) - receives shadows
  const floor = createPlane(ROOM_WIDTH, ROOM_DEPTH, mats.floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  floor.castShadow = false;
  scene.add(floor);

  // Ceiling at y=3.2
  const ceiling = createPlane(ROOM_WIDTH, ROOM_DEPTH, mats.ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_HEIGHT;
  ceiling.receiveShadow = false;
  scene.add(ceiling);

  // Create walls as single-sided planes facing inward
  // Back wall at z=-4 (darker)
  const backWall = createSingleSidedPlane(ROOM_WIDTH, ROOM_HEIGHT, mats.darkWallMaterial);
  backWall.position.set(0, ROOM_HEIGHT / 2, -ROOM_DEPTH / 2);
  backWall.rotation.y = 0;
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Front wall at z=4
  const frontWall = createSingleSidedPlane(ROOM_WIDTH, ROOM_HEIGHT, mats.wallMaterial);
  frontWall.position.set(0, ROOM_HEIGHT / 2, ROOM_DEPTH / 2);
  frontWall.rotation.y = Math.PI;
  frontWall.receiveShadow = true;
  scene.add(frontWall);

  // Left wall at x=-5
  const leftWall = createSingleSidedPlane(ROOM_DEPTH, ROOM_HEIGHT, mats.wallMaterial);
  leftWall.position.set(-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Right wall at x=5 (will have window, base part)
  const rightWallBase = createSingleSidedPlane(ROOM_DEPTH, ROOM_HEIGHT, mats.wallMaterial);
  rightWallBase.position.set(ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0);
  rightWallBase.rotation.y = -Math.PI / 2;
  rightWallBase.receiveShadow = true;
  scene.add(rightWallBase);

  // Special back wall: 44 walnut wood baskets (6×5cm) distributed over 6.2m
  createBasketWall(scene);

  // Window on right wall (x=+5)
  createWindow(scene);

  // Bottom frame and top cornice on all four walls
  createFramesAndCornices(scene);

  // Plant in corner (-4.3, 0, -3.3)
  createPlant(scene);

  // Temporary simple lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  return { floor, ceiling, backWall, frontWall, leftWall, rightWallBase };
}

function createBasketWall(scene) {
  const BASKET_COUNT = 44;
  const BASKET_WIDTH = 0.06;  // 6cm
  const BASKET_HEIGHT = 0.05; // 5cm
  const BASKET_DEPTH = 0.04;  // Thin
  const WALL_WIDTH = 6.2;     // Distribution width
  const WALL_Z = -ROOM_DEPTH / 2 + 0.2;

  // Create geometry for baskets
  const basketGeometry = new THREE.BoxGeometry(BASKET_WIDTH, BASKET_HEIGHT, BASKET_DEPTH);
  
  // Create instanced mesh for baskets
  const basketMesh = new THREE.InstancedMesh(basketGeometry, mats.walnutBasket, BASKET_COUNT);
  
  // Position baskets in a grid pattern
  const cols = 11;
  const rows = 4;
  let index = 0;
  
  for (let row = 0; row < rows && index < BASKET_COUNT; row++) {
    for (let col = 0; col < cols && index < BASKET_COUNT; col++) {
      const x = -WALL_WIDTH / 2 + (col * WALL_WIDTH / (cols - 1));
      const y = FRAME_HEIGHT + BASKET_HEIGHT / 2 + (row * BASKET_HEIGHT * 1.2);
      const z = WALL_Z;
      
      const matrix = new THREE.Matrix4();
      matrix.setPosition(x, y, z);
      basketMesh.setMatrixAt(index, matrix);
      index++;
    }
  }
  
  basketMesh.castShadow = true;
  basketMesh.receiveShadow = true;
  basketMesh.instanceMatrix.needsUpdate = true;
  scene.add(basketMesh);

  // Dark panel behind baskets
  const panelGeometry = new THREE.PlaneGeometry(WALL_WIDTH + 1, ROOM_HEIGHT - FRAME_HEIGHT - CORNICE_HEIGHT);
  const panelMesh = new THREE.Mesh(panelGeometry, mats.darkPanel);
  panelMesh.position.set(0, (ROOM_HEIGHT - CORNICE_HEIGHT) / 2 + FRAME_HEIGHT / 2, WALL_Z - 0.1);
  panelMesh.receiveShadow = true;
  scene.add(panelMesh);
}

function createWindow(scene) {
  const WINDOW_WIDTH = 3.2;
  const WINDOW_HEIGHT = 1.7;
  const WINDOW_Y = 1.75;
  const WALL_X = ROOM_WIDTH / 2;
  const WINDOW_Z = -ROOM_DEPTH / 2 + 0.3;
  const FRAME_THICKNESS = 0.08;

  // Window frame (around the window)
  const frameGeometry = new THREE.BoxGeometry(WINDOW_WIDTH + FRAME_THICKNESS * 2, WINDOW_HEIGHT + FRAME_THICKNESS * 2, FRAME_THICKNESS);
  const frameMesh = new THREE.Mesh(frameGeometry, mats.metalFrame);
  frameMesh.position.set(WALL_X - 0.1, WINDOW_Y, WINDOW_Z);
  frameMesh.castShadow = true;
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);

  // Glass window (semi-transparent)
  const glassGeometry = new THREE.PlaneGeometry(WINDOW_WIDTH, WINDOW_HEIGHT);
  const glassMesh = new THREE.Mesh(glassGeometry, mats.glassWindow);
  glassMesh.position.set(WALL_X - 0.05, WINDOW_Y, WINDOW_Z + 0.05);
  glassMesh.castShadow = false;
  glassMesh.receiveShadow = false;
  scene.add(glassMesh);

  // 14 metal curtain slices (vertical)
  const CURTAIN_COUNT = 14;
  const CURTAIN_WIDTH = WINDOW_WIDTH / CURTAIN_COUNT;
  const CURTAIN_HEIGHT = WINDOW_HEIGHT * 0.8;
  
  for (let i = 0; i < CURTAIN_COUNT; i++) {
    const x = WALL_X - WINDOW_WIDTH / 2 + (i + 0.5) * CURTAIN_WIDTH - 0.08;
    const curtainGeometry = new THREE.BoxGeometry(CURTAIN_WIDTH * 0.7, CURTAIN_HEIGHT, 0.01);
    const curtainMesh = new THREE.Mesh(curtainGeometry, mats.metalCurtain);
    curtainMesh.position.set(x, WINDOW_Y, WINDOW_Z + 0.08);
    curtainMesh.castShadow = true;
    curtainMesh.receiveShadow = false;
    scene.add(curtainMesh);
  }

  // Night city view panel behind window
  const cityPanelGeometry = new THREE.PlaneGeometry(WINDOW_WIDTH + 0.4, WINDOW_HEIGHT + 0.4);
  const cityPanelMesh = new THREE.Mesh(cityPanelGeometry, mats.nightCityTexture);
  cityPanelMesh.position.set(WALL_X - 0.2, WINDOW_Y, WINDOW_Z - 0.3);
  cityPanelMesh.receiveShadow = true;
  scene.add(cityPanelMesh);
}

function createFramesAndCornices(scene) {
  // Bottom frame (12cm) on all four walls
  // Back wall
  let frameGeometry = new THREE.PlaneGeometry(ROOM_WIDTH, FRAME_HEIGHT);
  let frameMesh = new THREE.Mesh(frameGeometry, mats.darkPanel);
  frameMesh.position.set(0, FRAME_HEIGHT / 2, -ROOM_DEPTH / 2 - 0.05);
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);

  // Front wall
  frameMesh = new THREE.Mesh(frameGeometry, mats.darkPanel);
  frameMesh.position.set(0, FRAME_HEIGHT / 2, ROOM_DEPTH / 2 + 0.05);
  frameMesh.rotation.y = Math.PI;
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);

  // Left wall
  frameGeometry = new THREE.PlaneGeometry(ROOM_DEPTH, FRAME_HEIGHT);
  frameMesh = new THREE.Mesh(frameGeometry, mats.darkPanel);
  frameMesh.position.set(-ROOM_WIDTH / 2 - 0.05, FRAME_HEIGHT / 2, 0);
  frameMesh.rotation.y = Math.PI / 2;
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);

  // Right wall
  frameMesh = new THREE.Mesh(frameGeometry, mats.darkPanel);
  frameMesh.position.set(ROOM_WIDTH / 2 + 0.05, FRAME_HEIGHT / 2, 0);
  frameMesh.rotation.y = -Math.PI / 2;
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);

  // Top cornice (8cm) on all four walls
  // Back wall
  frameGeometry = new THREE.PlaneGeometry(ROOM_WIDTH, CORNICE_HEIGHT);
  frameMesh = new THREE.Mesh(frameGeometry, mats.darkPanel);
  frameMesh.position.set(0, ROOM_HEIGHT - CORNICE_HEIGHT / 2, -ROOM_DEPTH / 2 - 0.05);
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);

  // Front wall
  frameMesh = new THREE.Mesh(frameGeometry, mats.darkPanel);
  frameMesh.position.set(0, ROOM_HEIGHT - CORNICE_HEIGHT / 2, ROOM_DEPTH / 2 + 0.05);
  frameMesh.rotation.y = Math.PI;
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);

  // Left wall
  frameGeometry = new THREE.PlaneGeometry(ROOM_DEPTH, CORNICE_HEIGHT);
  frameMesh = new THREE.Mesh(frameGeometry, mats.darkPanel);
  frameMesh.position.set(-ROOM_WIDTH / 2 - 0.05, ROOM_HEIGHT - CORNICE_HEIGHT / 2, 0);
  frameMesh.rotation.y = Math.PI / 2;
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);

  // Right wall
  frameMesh = new THREE.Mesh(frameGeometry, mats.darkPanel);
  frameMesh.position.set(ROOM_WIDTH / 2 + 0.05, ROOM_HEIGHT - CORNICE_HEIGHT / 2, 0);
  frameMesh.rotation.y = -Math.PI / 2;
  frameMesh.receiveShadow = true;
  scene.add(frameMesh);
}

function createPlant(scene) {
  const POT_X = -4.3;
  const POT_Y = 0;
  const POT_Z = -3.3;

  // Pot (cylindrical)
  const potRadius = 0.08;
  const potHeight = 0.15;
  const potGeometry = new THREE.CylinderGeometry(potRadius, potRadius * 1.1, potHeight, 16);
  const potMesh = new THREE.Mesh(potGeometry, mats.potMaterial);
  potMesh.position.set(POT_X, potHeight / 2, POT_Z);
  potMesh.castShadow = true;
  potMesh.receiveShadow = true;
  scene.add(potMesh);

  // 9 leaves (as tilted boxes)
  const LEAF_COUNT = 9;
  const LEAF_WIDTH = 0.04;
  const LEAF_HEIGHT = 0.25;
  const LEAF_DEPTH = 0.015;

  for (let i = 0; i < LEAF_COUNT; i++) {
    const angle = (i / LEAF_COUNT) * Math.PI * 2;
    const leafGeometry = new THREE.BoxGeometry(LEAF_WIDTH, LEAF_HEIGHT, LEAF_DEPTH);
    const leafMesh = new THREE.Mesh(leafGeometry, mats.leafMaterial);
    
    // Position around pot center
    const offsetX = Math.cos(angle) * potRadius * 0.7;
    const offsetZ = Math.sin(angle) * potRadius * 0.7;
    
    leafMesh.position.set(
      POT_X + offsetX,
      potHeight + LEAF_HEIGHT / 2,
      POT_Z + offsetZ
    );
    
    // Tilt leaves outward and rotate them
    leafMesh.rotation.z = (Math.PI / 2) * (0.3 + 0.2 * Math.random());
    leafMesh.rotation.x = angle - Math.PI / 2;
    
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    scene.add(leafMesh);
  }
}
