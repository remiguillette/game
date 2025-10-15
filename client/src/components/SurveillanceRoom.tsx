import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function SurveillanceRoom() {
  const floorTexture = useTexture("/textures/asphalt.png");
  const wallTexture = useTexture("/textures/wood.jpg");

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
      
      {/* Back Wall with large monitor wall */}
      <mesh position={[0, 3, -6]}>
        <boxGeometry args={[16, 6, 0.2]} />
        <meshLambertMaterial color="#1f2937" />
      </mesh>
      
      {/* Large monitoring screens on back wall */}
      {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
        <mesh key={i} position={[x, 3, -5.8]}>
          <boxGeometry args={[2, 1.5, 0.1]} />
          <meshLambertMaterial 
            color="#1a1a2e" 
            emissive="#0066ff"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
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
      
      {/* Control desk in center */}
      <mesh position={[0, 0.5, 2]}>
        <boxGeometry args={[6, 0.2, 2]} />
        <meshLambertMaterial color="#4a5568" />
      </mesh>
      
      {/* Monitor panels on control desk */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 1.8]}>
          <boxGeometry args={[1.2, 0.8, 0.1]} />
          <meshLambertMaterial 
            color="#000" 
            emissive="#00ff00"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      
      {/* Server racks on sides */}
      <mesh position={[-6, 2, 0]}>
        <boxGeometry args={[1, 4, 1]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      
      <mesh position={[6, 2, 0]}>
        <boxGeometry args={[1, 4, 1]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      
      {/* Indicator lights on servers */}
      {[-6, 6].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.5, 0.6]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshLambertMaterial 
              color="#ff0000" 
              emissive="#ff0000"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[x, 2, 0.6]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshLambertMaterial 
              color="#00ff00" 
              emissive="#00ff00"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[x, 2.5, 0.6]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshLambertMaterial 
              color="#0000ff" 
              emissive="#0000ff"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
