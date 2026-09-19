import * as THREE from 'three';

// Shared materials object
export const mats = {
  floorMaterial: null,
  wallMaterial: null,
  ceilingMaterial: null,
  darkWallMaterial: null,
  walnutBasket: null,
  darkPanel: null,
  glassWindow: null,
  metalFrame: null,
  metalCurtain: null,
  nightCityTexture: null,
  potMaterial: null,
  leafMaterial: null,
};

// Canvas-based procedural texture generators
function createConcreteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Base light gray
  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(0, 0, 512, 512);
  
  // Add subtle noise
  const imageData = ctx.getImageData(0, 0, 512, 512);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }
  ctx.putImageData(imageData, 0, 0);
  
  // Draw tile lines (10x8 grid of tiles)
  ctx.strokeStyle = '#a0a0a0';
  ctx.lineWidth = 1;
  const tileW = 512 / 10;
  const tileH = 512 / 8;
  for (let i = 1; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tileW, 0);
    ctx.lineTo(i * tileW, 512);
    ctx.stroke();
  }
  for (let i = 1; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * tileH);
    ctx.lineTo(512, i * tileH);
    ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

function createNightCityTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Purple gradient sky
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#4a0080');   // Dark purple top
  gradient.addColorStop(0.5, '#6b2694'); // Medium purple
  gradient.addColorStop(1, '#2d0052');   // Very dark purple bottom
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  
  // Draw buildings with lit windows
  ctx.fillStyle = '#1a1a1a';
  const buildingWidth = 60;
  const buildingHeight = 300;
  
  for (let bx = 0; bx < 512; bx += buildingWidth) {
    const height = 200 + Math.random() * buildingHeight;
    ctx.fillRect(bx, 512 - height, buildingWidth, height);
    
    // Draw lit windows
    ctx.fillStyle = '#ffff99';
    for (let wy = 512 - height + 20; wy < 512; wy += 25) {
      for (let wx = bx + 8; wx < bx + buildingWidth; wx += 25) {
        if (Math.random() > 0.3) {
          ctx.fillRect(wx, wy, 12, 15);
        }
      }
    }
    ctx.fillStyle = '#1a1a1a';
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

// Initialize all materials
export function initMaterials() {
  // Floor: polished concrete with procedural texture
  const concreteTexture = createConcreteTexture();
  mats.floorMaterial = new THREE.MeshStandardMaterial({
    map: concreteTexture,
    metalness: 0.2,
    roughness: 0.3,
  });

  // Wall material - dark
  mats.wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0,
    roughness: 1,
  });

  // Darker wall material for back wall
  mats.darkWallMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0,
    roughness: 1,
  });

  // Ceiling material - very dark
  mats.ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f0f1e,
    metalness: 0,
    roughness: 1,
  });

  // Walnut wood for baskets
  mats.walnutBasket = new THREE.MeshStandardMaterial({
    color: 0x3e2723,
    metalness: 0.1,
    roughness: 0.5,
  });

  // Dark panel for behind basket wall and window
  mats.darkPanel = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    metalness: 0,
    roughness: 1,
  });

  // Semi-transparent glass window
  mats.glassWindow = new THREE.MeshStandardMaterial({
    color: 0xaaccff,
    metalness: 0.05,
    roughness: 0.1,
    transparent: true,
    opacity: 0.5,
  });

  // Metal frame for window
  mats.metalFrame = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.8,
    roughness: 0.3,
  });

  // Metal curtain material
  mats.metalCurtain = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.7,
    roughness: 0.2,
  });

  // Night city texture for window view
  mats.nightCityTexture = new THREE.MeshStandardMaterial({
    map: createNightCityTexture(),
    metalness: 0,
    roughness: 1,
  });

  // Pot material - terracotta
  mats.potMaterial = new THREE.MeshStandardMaterial({
    color: 0xcd5c5c,
    metalness: 0,
    roughness: 0.7,
  });

  // Leaf material - green
  mats.leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d5016,
    metalness: 0,
    roughness: 0.6,
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

// Single-sided plane (wall)
export function createSingleSidedPlane(width, height, material) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const plane = new THREE.Mesh(geometry, material);
  return plane;
}
