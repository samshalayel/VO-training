import * as THREE from 'three';

// Shared materials object
export const mats = {
  floorMaterial: null,
  wallMaterial: null,
  ceilingMaterial: null,
  neonCyan: null,
  neonMagenta: null,
};

// Initialize all materials
export function initMaterials() {
  // Floor: light gray shiny material
  mats.floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0b0b0,
    metalness: 0.3,
    roughness: 0.2,
  });

  // Wall material
  mats.wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0,
    roughness: 1,
  });

  // Ceiling material
  mats.ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f0f1e,
    metalness: 0,
    roughness: 1,
  });

  // Neon colors for future use
  mats.neonCyan = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
  });

  mats.neonMagenta = new THREE.MeshBasicMaterial({
    color: 0xff2bd6,
  });
}

// Shape generators
export function createBox(width, height, depth, material) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  return new THREE.Mesh(geometry, material);
}

export function createPlane(width, depth, material) {
  const geometry = new THREE.PlaneGeometry(width, depth);
  return new THREE.Mesh(geometry, material);
}

export function createCylinder(radiusTop, radiusBottom, height, segments, material) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
  return new THREE.Mesh(geometry, material);
}

export function createSphere(radius, widthSegments, heightSegments, material) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  return new THREE.Mesh(geometry, material);
}