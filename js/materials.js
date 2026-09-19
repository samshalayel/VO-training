import * as THREE from 'three';

// Shared materials object
export const mats = {
  floorMaterial: null,
  wallMaterial: null,
  ceilingMaterial: null,
  neonCyan: null,
  neonMagenta: null,
  walnut: null,
  deskTop: null,
  blackMetal: null,
  chrome: null,
  leather: null,
  leatherStitch: null,
  fabric: null,
  screen: null,
  neonWarm: null,
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

  // Furniture materials
  // Walnut wood for desk base
  mats.walnut = new THREE.MeshStandardMaterial({
    color: 0x3e2723,
    metalness: 0,
    roughness: 0.4,
  });

  // Dark glass top for desk
  mats.deskTop = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
  });

  // Black metal for drawer handles and parts
  mats.blackMetal = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    metalness: 0.8,
    roughness: 0.3,
  });

  // Chrome for shiny metal parts
  mats.chrome = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.95,
    roughness: 0.1,
  });

  // Leather for chairs
  mats.leather = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0,
    roughness: 0.6,
  });

  // Leather with stitching appearance
  mats.leatherStitch = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0,
    roughness: 0.65,
    map: null, // Could add texture map here
  });

  // Dark blue fabric for guest chairs
  mats.fabric = new THREE.MeshStandardMaterial({
    color: 0x0d1b2a,
    metalness: 0,
    roughness: 0.8,
  });

  // Dark blue emissive screen material
  mats.screen = new THREE.MeshStandardMaterial({
    color: 0x001a33,
    emissive: 0x0033ff,
    emissiveIntensity: 0.3,
    metalness: 0.2,
    roughness: 0.3,
  });

  // Warm neon color
  mats.neonWarm = new THREE.MeshBasicMaterial({
    color: 0xffa500,
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
