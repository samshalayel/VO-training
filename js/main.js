import * as THREE from 'three';
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
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
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

// Request render on any user interaction
window.addEventListener('mousemove', requestRender);
window.addEventListener('mousedown', requestRender);
window.addEventListener('mouseup', requestRender);
window.addEventListener('keydown', requestRender);
window.addEventListener('keyup', requestRender);
window.addEventListener('touchstart', requestRender);
window.addEventListener('touchmove', requestRender);
window.addEventListener('touchend', requestRender);

console.log('Scene initialized successfully');
