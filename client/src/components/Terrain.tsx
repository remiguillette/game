import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Terrain() {
  const terrainTexture = useTexture("/textures/grass.png");

  terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
  terrainTexture.repeat.set(12, 10);

  return (
    <mesh position={[0, -0.21, 0]}>
      <boxGeometry args={[40, 0.02, 30]} />
      <meshLambertMaterial map={terrainTexture} color="#3f4c3f" />
    </mesh>
  );
}
