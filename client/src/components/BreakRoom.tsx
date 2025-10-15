import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function BreakRoom() {
  const floorTexture = useTexture("/textures/wood.jpg");
  const wallTexture = useTexture("/textures/grass.png");

  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(6, 6);
  
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(3, 2);

  // Pre-calculate plant positions to avoid Math.random in render
  const plantPositions = useMemo(() => [
    { x: -6, z: -4 },
    { x: 6, z: -4 },
    { x: -6, z: 4 },
    { x: 6, z: 4 }
  ], []);

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
        <meshLambertMaterial map={wallTexture} color="#8fbc8f" />
      </mesh>
      
      {/* Windows on back wall */}
      {[-4, 0, 4].map((x, i) => (
        <mesh key={i} position={[x, 3.5, -5.9]}>
          <boxGeometry args={[2, 2, 0.05]} />
          <meshLambertMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}
      
      {/* Left Wall */}
      <mesh position={[-8, 3, 0]}>
        <boxGeometry args={[0.2, 6, 12]} />
        <meshLambertMaterial map={wallTexture} color="#8fbc8f" />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[8, 3, 0]}>
        <boxGeometry args={[0.2, 6, 12]} />
        <meshLambertMaterial map={wallTexture} color="#8fbc8f" />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshLambertMaterial color="#f5f5dc" />
      </mesh>
      
      {/* Sofas/Couches */}
      <group position={[-3, 0.4, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.8, 1]} />
          <meshLambertMaterial color="#8b4789" />
        </mesh>
        <mesh position={[0, 0.5, -0.5]}>
          <boxGeometry args={[2.5, 0.6, 0.3]} />
          <meshLambertMaterial color="#8b4789" />
        </mesh>
      </group>
      
      <group position={[3, 0.4, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.8, 1]} />
          <meshLambertMaterial color="#4682b4" />
        </mesh>
        <mesh position={[0, 0.5, -0.5]}>
          <boxGeometry args={[2.5, 0.6, 0.3]} />
          <meshLambertMaterial color="#4682b4" />
        </mesh>
      </group>
      
      {/* Coffee table in center */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      
      {/* Coffee cups on table */}
      <mesh position={[-0.5, 0.45, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.15]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[0.5, 0.45, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.15]} />
        <meshLambertMaterial color="#d2691e" />
      </mesh>
      
      {/* Vending machine */}
      <mesh position={[-7, 1.5, -3]}>
        <boxGeometry args={[1, 3, 1]} />
        <meshLambertMaterial color="#dc143c" />
      </mesh>
      
      {/* Vending machine screen */}
      <mesh position={[-6.4, 2, -3]}>
        <boxGeometry args={[0.05, 1, 0.6]} />
        <meshLambertMaterial 
          color="#000" 
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Water cooler */}
      <group position={[7, 0.5, -3]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1]} />
          <meshLambertMaterial color="#4169e1" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.35, 0.3, 0.4]} />
          <meshLambertMaterial color="#1e90ff" transparent opacity={0.8} />
        </mesh>
      </group>
      
      {/* Potted plants in corners */}
      {plantPositions.map((pos, i) => (
        <group key={i} position={[pos.x, 0, pos.z]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.3, 0.25, 0.6]} />
            <meshLambertMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.4]} />
            <meshLambertMaterial color="#228b22" />
          </mesh>
        </group>
      ))}
      
      {/* Wall art/poster */}
      <mesh position={[0, 3, -5.8]}>
        <boxGeometry args={[1.5, 1, 0.05]} />
        <meshLambertMaterial color="#ffa500" />
      </mesh>
    </group>
  );
}
