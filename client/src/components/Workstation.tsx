import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WorkstationProps {
  position: [number, number, number];
  workstationId: string;
  isActive: boolean;
}

export default function Workstation({ position, workstationId, isActive }: WorkstationProps) {
  const [hovered, setHovered] = useState(false);
  const monitorRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (monitorRef.current && isActive) {
      // Pulsing effect for active workstations
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 0.9;
      monitorRef.current.material.emissive.setScalar(pulse * 0.2);
    }
  });

  return (
    <group position={position}>
      {/* Desk */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.1, 1.2]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
      
      {/* Desk legs */}
      {[[-0.8, -0.6], [0.8, -0.6], [-0.8, 0.6], [0.8, 0.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
      ))}
      
      {/* Monitor */}
      <mesh 
        ref={monitorRef}
        position={[0, 0.8, -0.3]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 0.6, 0.1]} />
        <meshLambertMaterial 
          color={isActive ? "#00ff00" : hovered ? "#4444ff" : "#222"} 
          emissive={isActive ? "#002200" : "#000000"}
        />
      </mesh>
      
      {/* Monitor stand */}
      <mesh position={[0, 0.5, -0.2]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      
      {/* Keyboard */}
      <mesh position={[0, 0.46, 0.2]}>
        <boxGeometry args={[0.6, 0.02, 0.3]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      
      {/* Mouse */}
      <mesh position={[0.4, 0.46, 0.3]}>
        <boxGeometry args={[0.08, 0.02, 0.12]} />
        <meshLambertMaterial color="#666" />
      </mesh>
      
      {/* Chair */}
      <mesh position={[0, 0.3, 0.8]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshLambertMaterial color="#444" />
      </mesh>
      
      <mesh position={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      
      {/* Workstation ID label */}
      <mesh position={[0, 1.5, -0.5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.02]} />
        <meshLambertMaterial color="#fff" />
      </mesh>
    </group>
  );
}
