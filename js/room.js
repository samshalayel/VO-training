import * as THREE from 'three';
import { mats, createPlane, createBox } from './materials.js';

// Room dimensions
const ROOM_WIDTH = 10;
const ROOM_DEPTH = 8;
const ROOM_HEIGHT = 3.2;

export function createRoom(scene) {
  // Floor (10×8 at y=0)
  const floor = createPlane(ROOM_WIDTH, ROOM_DEPTH, mats.floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  // Walls
  // Back wall
  const backWall = createBox(ROOM_WIDTH, ROOM_HEIGHT, 0.1, mats.wallMaterial);
  backWall.position.z = -ROOM_DEPTH / 2;
  backWall.position.y = ROOM_HEIGHT / 2;
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Front wall
  const frontWall = createBox(ROOM_WIDTH, ROOM_HEIGHT, 0.1, mats.wallMaterial);
  frontWall.position.z = ROOM_DEPTH / 2;
  frontWall.position.y = ROOM_HEIGHT / 2;
  frontWall.receiveShadow = true;
  scene.add(frontWall);

  // Left wall
  const leftWall = createBox(0.1, ROOM_HEIGHT, ROOM_DEPTH, mats.wallMaterial);
  leftWall.position.x = -ROOM_WIDTH / 2;
  leftWall.position.y = ROOM_HEIGHT / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Right wall
  const rightWall = createBox(0.1, ROOM_HEIGHT, ROOM_DEPTH, mats.wallMaterial);
  rightWall.position.x = ROOM_WIDTH / 2;
  rightWall.position.y = ROOM_HEIGHT / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Ceiling
  const ceiling = createPlane(ROOM_WIDTH, ROOM_DEPTH, mats.ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_HEIGHT;
  scene.add(ceiling);

  // Lighting
  // HemisphereLight: pale blue sky, dark purple ground, intensity 0.4
  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x4d0066, 0.4);
  scene.add(hemisphereLight);

  // Warm DirectionalLight with soft shadows
  const directionalLight = new THREE.DirectionalLight(0xfff1e0, 1.6);
  directionalLight.position.set(2.5, 3, 2.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.type = THREE.PCFSoftShadowMap;
  scene.add(directionalLight);

  // Neon strips with PointLights
  // Vertical cyan strips framing the basket wall (back wall)
  const leftNeonStrip = createBox(0.1, ROOM_HEIGHT * 0.8, 0.05, mats.neonCyan);
  leftNeonStrip.position.set(-ROOM_WIDTH / 2 + 0.3, ROOM_HEIGHT * 0.6, -ROOM_DEPTH / 2 + 0.1);
  leftNeonStrip.castShadow = false;
  leftNeonStrip.receiveShadow = false;
  scene.add(leftNeonStrip);

  const rightNeonStrip = createBox(0.1, ROOM_HEIGHT * 0.8, 0.05, mats.neonCyan);
  rightNeonStrip.position.set(ROOM_WIDTH / 2 - 0.3, ROOM_HEIGHT * 0.6, -ROOM_DEPTH / 2 + 0.1);
  rightNeonStrip.castShadow = false;
  rightNeonStrip.receiveShadow = false;
  scene.add(rightNeonStrip);

  // Cyan PointLights near vertical strips
  const leftCyanLight = new THREE.PointLight(0x00e5ff, 3.5, 5);
  leftCyanLight.position.set(-ROOM_WIDTH / 2 + 0.5, ROOM_HEIGHT * 0.6, -ROOM_DEPTH / 2 + 0.5);
  scene.add(leftCyanLight);

  const rightCyanLight = new THREE.PointLight(0x00e5ff, 3.5, 5);
  rightCyanLight.position.set(ROOM_WIDTH / 2 - 0.5, ROOM_HEIGHT * 0.6, -ROOM_DEPTH / 2 + 0.5);
  scene.add(rightCyanLight);

  // Top cornice magenta neon on back wall
  const backTopNeon = createBox(ROOM_WIDTH - 1, 0.1, 0.05, mats.neonMagenta);
  backTopNeon.position.set(0, ROOM_HEIGHT - 0.2, -ROOM_DEPTH / 2 + 0.05);
  backTopNeon.castShadow = false;
  backTopNeon.receiveShadow = false;
  scene.add(backTopNeon);

  // Top cornice on left side
  const leftTopNeon = createBox(0.1, 0.1, ROOM_DEPTH * 0.3, mats.neonMagenta);
  leftTopNeon.position.set(-ROOM_WIDTH / 2 + 0.2, ROOM_HEIGHT - 0.2, -ROOM_DEPTH / 2 + ROOM_DEPTH * 0.15);
  leftTopNeon.castShadow = false;
  leftTopNeon.receiveShadow = false;
  scene.add(leftTopNeon);

  // Top cornice on right side
  const rightTopNeon = createBox(0.1, 0.1, ROOM_DEPTH * 0.3, mats.neonMagenta);
  rightTopNeon.position.set(ROOM_WIDTH / 2 - 0.2, ROOM_HEIGHT - 0.2, -ROOM_DEPTH / 2 + ROOM_DEPTH * 0.15);
  rightTopNeon.castShadow = false;
  rightTopNeon.receiveShadow = false;
  scene.add(rightTopNeon);

  // Magenta PointLight for top neon
  const magentaLight = new THREE.PointLight(0xff2bd6, 3.5, 5);
  magentaLight.position.set(0, ROOM_HEIGHT - 0.3, -ROOM_DEPTH / 2 + 1);
  scene.add(magentaLight);

  // LED floor line on left side
  const leftFloorNeon = createBox(0.05, 0.05, ROOM_DEPTH * 0.4, mats.neonCyan);
  leftFloorNeon.position.set(-ROOM_WIDTH / 2 + 0.2, 0.05, -ROOM_DEPTH / 2 + ROOM_DEPTH * 0.2);
  leftFloorNeon.castShadow = false;
  leftFloorNeon.receiveShadow = false;
  scene.add(leftFloorNeon);

  // LED floor line on right side
  const rightFloorNeon = createBox(0.05, 0.05, ROOM_DEPTH * 0.4, mats.neonCyan);
  rightFloorNeon.position.set(ROOM_WIDTH / 2 - 0.2, 0.05, -ROOM_DEPTH / 2 + ROOM_DEPTH * 0.2);
  rightFloorNeon.castShadow = false;
  rightFloorNeon.receiveShadow = false;
  scene.add(rightFloorNeon);

  // PointLights for floor LEDs
  const leftFloorLight = new THREE.PointLight(0x00e5ff, 3.5, 5);
  leftFloorLight.position.set(-ROOM_WIDTH / 2 + 0.5, 0.5, -ROOM_DEPTH / 2 + ROOM_DEPTH * 0.2);
  scene.add(leftFloorLight);

  const rightFloorLight = new THREE.PointLight(0x00e5ff, 3.5, 5);
  rightFloorLight.position.set(ROOM_WIDTH / 2 - 0.5, 0.5, -ROOM_DEPTH / 2 + ROOM_DEPTH * 0.2);
  scene.add(rightFloorLight);

  return { floor, backWall, frontWall, leftWall, rightWall, ceiling };
}