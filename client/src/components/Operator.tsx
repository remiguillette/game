import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface OperatorData {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'responding';
  experience: number;
  assignedWorkstation?: string;
  x: number;
  z: number;
}

interface OperatorProps {
  operator: OperatorData;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

export default function Operator({ operator, position, isSelected, onClick }: OperatorProps) {
  const [hovered, setHovered] = useState(false);
  const operatorRef = useRef<THREE.Group>(null);
  const bobRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    // Gentle bobbing animation
    if (bobRef.current) {
      bobRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    
    // Rotate selected operator
    if (operatorRef.current && isSelected) {
      operatorRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const getStatusColor = () => {
    switch (operator.status) {
      case 'busy': return "#ff6b6b";
      case 'responding': return "#ffd93d";
      case 'idle': 
      default: return "#51cf66";
    }
  };

  const getExperienceColor = () => {
    if (operator.experience > 80) return "#4c6ef5";
    if (operator.experience > 60) return "#51cf66"; 
    if (operator.experience > 40) return "#ffd43b";
    return "#ff8787";
  };

  return (
    <group 
      ref={operatorRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Body */}
      <mesh 
        ref={bobRef}
        position={[0, 0.8, 0]}
      >
        <boxGeometry args={[0.4, 0.8, 0.2]} />
        <meshLambertMaterial 
          color={hovered ? "#6b7280" : "#374151"}
          emissive={isSelected ? "#001100" : "#000000"}
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshLambertMaterial color="#f3e8ff" />
      </mesh>
      
      {/* Status indicator (hat/helmet) */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[0.25, 0.1, 0.25]} />
        <meshLambertMaterial 
          color={getStatusColor()}
          emissive={getStatusColor()}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Experience badge on chest */}
      <mesh position={[0, 0.9, 0.11]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshLambertMaterial 
          color={getExperienceColor()}
          emissive={getExperienceColor()}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3, 0.7, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshLambertMaterial color="#8b5cf6" />
      </mesh>
      
      <mesh position={[0.3, 0.7, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshLambertMaterial color="#8b5cf6" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      
      <mesh position={[0.1, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshLambertMaterial color="#1e293b" />
      </mesh>
      
      {/* Name tag floating above */}
      {(hovered || isSelected) && (
        <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1, 0.2, 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}
