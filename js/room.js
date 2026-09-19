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
  scene.add(backWall);

  // Front wall
  const frontWall = createBox(ROOM_WIDTH, ROOM_HEIGHT, 0.1, mats.wallMaterial);
  frontWall.position.z = ROOM_DEPTH / 2;
  frontWall.position.y = ROOM_HEIGHT / 2;
  scene.add(frontWall);

  // Left wall
  const leftWall = createBox(0.1, ROOM_HEIGHT, ROOM_DEPTH, mats.wallMaterial);
  leftWall.position.x = -ROOM_WIDTH / 2;
  leftWall.position.y = ROOM_HEIGHT / 2;
  scene.add(leftWall);

  // Right wall
  const rightWall = createBox(0.1, ROOM_HEIGHT, ROOM_DEPTH, mats.wallMaterial);
  rightWall.position.x = ROOM_WIDTH / 2;
  rightWall.position.y = ROOM_HEIGHT / 2;
  scene.add(rightWall);

  // Ceiling
  const ceiling = createPlane(ROOM_WIDTH, ROOM_DEPTH, mats.ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_HEIGHT;
  scene.add(ceiling);

  // Lighting
  // Ambient light for general illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Directional light simulating window light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 3, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  return { floor, backWall, frontWall, leftWall, rightWall, ceiling };
}