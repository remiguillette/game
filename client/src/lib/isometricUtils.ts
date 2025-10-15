import * as THREE from 'three';

/**
 * Utility functions for isometric view calculations and transformations
 */

export interface IsometricPosition {
  x: number;
  y: number; 
  z: number;
}

export interface ScreenPosition {
  x: number;
  y: number;
}

/**
 * Convert world coordinates to isometric screen coordinates
 */
export function worldToIsometric(worldPos: IsometricPosition): ScreenPosition {
  const isoX = (worldPos.x - worldPos.z) * Math.cos(Math.PI / 6);
  const isoY = (worldPos.x + worldPos.z) * Math.sin(Math.PI / 6) - worldPos.y;
  
  return { x: isoX, y: isoY };
}

/**
 * Convert isometric screen coordinates to world coordinates (assuming y = 0)
 */
export function isometricToWorld(screenPos: ScreenPosition, y: number = 0): IsometricPosition {
  const cos30 = Math.cos(Math.PI / 6);
  const sin30 = Math.sin(Math.PI / 6);
  
  const worldX = (screenPos.x / cos30 + (screenPos.y + y) / sin30) / 2;
  const worldZ = (screenPos.y + y) / sin30 - worldX;
  
  return { x: worldX, y, z: worldZ };
}

/**
 * Create an isometric camera with proper positioning
 */
export function createIsometricCamera(): THREE.OrthographicCamera {
  const aspect = window.innerWidth / window.innerHeight;
  const size = 10;
  
  const camera = new THREE.OrthographicCamera(
    -size * aspect,
    size * aspect,
    size,
    -size,
    0.1,
    1000
  );
  
  // Position for isometric view
  camera.position.set(10, 15, 10);
  camera.lookAt(0, 0, 0);
  
  return camera;
}

/**
 * Get isometric tile coordinates from world position
 */
export function getIsometricTile(worldPos: IsometricPosition, tileSize: number = 1): { tileX: number; tileZ: number } {
  const tileX = Math.floor(worldPos.x / tileSize);
  const tileZ = Math.floor(worldPos.z / tileSize);
  
  return { tileX, tileZ };
}

/**
 * Get world position from isometric tile coordinates
 */
export function getTileWorldPosition(tileX: number, tileZ: number, tileSize: number = 1): IsometricPosition {
  return {
    x: tileX * tileSize + tileSize / 2,
    y: 0,
    z: tileZ * tileSize + tileSize / 2
  };
}

/**
 * Calculate isometric depth sorting for proper rendering order
 */
export function calculateIsometricDepth(position: IsometricPosition): number {
  return position.x + position.z - position.y;
}

/**
 * Generate isometric grid positions
 */
export function generateIsometricGrid(width: number, height: number, tileSize: number = 1): IsometricPosition[] {
  const positions: IsometricPosition[] = [];
  
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < height; z++) {
      positions.push(getTileWorldPosition(x, z, tileSize));
    }
  }
  
  return positions;
}

/**
 * Check if two isometric positions are adjacent
 */
export function areIsometricTilesAdjacent(pos1: IsometricPosition, pos2: IsometricPosition, tileSize: number = 1): boolean {
  const tile1 = getIsometricTile(pos1, tileSize);
  const tile2 = getIsometricTile(pos2, tileSize);
  
  const deltaX = Math.abs(tile1.tileX - tile2.tileX);
  const deltaZ = Math.abs(tile1.tileZ - tile2.tileZ);
  
  return (deltaX === 1 && deltaZ === 0) || (deltaX === 0 && deltaZ === 1);
}

/**
 * Calculate Manhattan distance between two isometric tiles
 */
export function getIsometricManhattanDistance(pos1: IsometricPosition, pos2: IsometricPosition, tileSize: number = 1): number {
  const tile1 = getIsometricTile(pos1, tileSize);
  const tile2 = getIsometricTile(pos2, tileSize);
  
  return Math.abs(tile1.tileX - tile2.tileX) + Math.abs(tile1.tileZ - tile2.tileZ);
}
