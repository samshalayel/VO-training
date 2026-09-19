import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PMREMGenerator } from 'three/addons/pmrem/PMREMGenerator.js';
import { initMaterials } from './materials.js';
import { createRoom } from './room.js';
import { addFurniture } from './furniture.js';

// Initialize scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05060a);

// Initialize renderer
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
const dpr = Math.min(window.devicePixelRatio, 1.5);
renderer.setPixelRatio(dpr);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

// Initialize camera
// PerspectiveCamera at (0, 1.75, 4.6) looking at (0, 1, -1.4)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.75, 4.6);
camera.lookAt(0, 1, -1.4);

// Initialize materials
initMaterials();

// Create room (floor, walls, ceiling, lighting)
createRoom(scene);

// Add furniture to scene
addFurniture(scene);

// Setup environment map with RoomEnvironment
const pmremGenerator = new PMREMGenerator(renderer);
const roomEnvironment = new RoomEnvironment();
const envMap = pmremGenerator.fromScene(roomEnvironment, 0.45);
scene.environment = envMap;
pmremGenerator.dispose();
roomEnvironment.dispose();

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1.6;
controls.maxDistance = 6.4;
controls.target.set(0, 1, -1.4);

// Vertical angle limits (prevent going below ground)
controls.minPolarAngle = Math.PI * 0.1;
controls.maxPolarAngle = Math.PI * 0.9;

// Horizontal angle limits (±1.15 radians to keep basket wall in frame)
controls.minAzimuthAngle = -1.15;
controls.maxAzimuthAngle = 1.15;

// Panning limits (keep within room)
const roomWidth = 10;
const roomDepth = 8;
controls.screenSpacePanning = true;
const panLimitX = roomWidth / 2 - 1;
const panLimitZ = roomDepth / 2 - 1;

// Wall collision detection function
function checkWallCollision(position) {
  const minX = -roomWidth / 2 + 0.5;
  const maxX = roomWidth / 2 - 0.5;
  const minZ = -roomDepth / 2 + 0.5;
  const maxZ = roomDepth / 2 - 0.5;
  const minY = 0.5;
  const maxY = 3.2 - 0.5;

  if (position.x < minX) position.x = minX;
  if (position.x > maxX) position.x = maxX;
  if (position.z < minZ) position.z = minZ;
  if (position.z > maxZ) position.z = maxZ;
  if (position.y < minY) position.y = minY;
  if (position.y > maxY) position.y = maxY;
}

// Apply collision detection on control changes
controls.addEventListener('change', () => {
  checkWallCollision(camera.position);
  requestRender();
});

// Loading screen management
const loadingScreen = document.getElementById('loading-screen');

function hideLoadingScreen() {
  loadingScreen.classList.add('hidden');
}

// Simulate loading complete after a short delay
setTimeout(hideLoadingScreen, 500);

// Render loop (render on demand - only when needed)
let needsRender = true;

function render() {
  renderer.render(scene, camera);
}

function requestRender() {
  needsRender = true;
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (needsRender) {
    render();
    needsRender = false;
  }
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  requestRender();
});

// Request render on resize and user interaction
window.addEventListener('touchstart', requestRender);
window.addEventListener('touchmove', requestRender);
window.addEventListener('touchend', requestRender);

console.log('Scene initialized successfully');
