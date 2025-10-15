import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Room() {
  const floorTexture = useTexture("/textures/asphalt.png");
  const wallTexture = useTexture("/textures/wood.jpg");

  // Configure texture repeating
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 4);
  
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(2, 1);

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshLambertMaterial map={floorTexture} />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 3, -6]}>
        <boxGeometry args={[16, 6, 0.2]} />
        <meshLambertMaterial map={wallTexture} color="#6b7280" />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-8, 3, 0]}>
        <boxGeometry args={[0.2, 6, 12]} />
        <meshLambertMaterial map={wallTexture} color="#6b7280" />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[8, 3, 0]}>
        <boxGeometry args={[0.2, 6, 12]} />
        <meshLambertMaterial map={wallTexture} color="#6b7280" />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Central pillar for visual depth */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.4, 6, 0.4]} />
        <meshLambertMaterial color="#1f2937" />
      </mesh>
      
      {/* Some decorative elements */}
      <mesh position={[-6, 1, -5.8]}>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshLambertMaterial color="#3b82f6" />
      </mesh>
      
      <mesh position={[6, 1, -5.8]}>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshLambertMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}
