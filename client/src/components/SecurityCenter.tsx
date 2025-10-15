import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Room from "./Room";
import Operator from "./Operator";
import Workstation from "./Workstation";
import { useOperators } from "../hooks/useOperators";
import { useEmergencies } from "../hooks/useEmergencies";
import { useGameLoop } from "../hooks/useGameLoop";
import { useSecurityCenter } from "../lib/stores/useSecurityCenter";

export default function SecurityCenter() {
  const groupRef = useRef<THREE.Group>(null);
  const { operators, updateOperatorStatus } = useOperators();
  const { emergencies, resolveEmergency } = useEmergencies();
  const { selectedOperator, setSelectedOperator } = useSecurityCenter();
  
  // Game loop for automatic emergency handling
  useGameLoop({ emergencies, operators, updateOperatorStatus, resolveEmergency });

  // Rotate the entire scene slightly for better isometric view
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1 - 0.3;
    }
  });

  // Define workstation positions in isometric grid
  const workstationPositions = [
    { x: -4, z: -2, id: 1 },
    { x: -2, z: -2, id: 2 },
    { x: 0, z: -2, id: 3 },
    { x: 2, z: -2, id: 4 },
    { x: -4, z: 2, id: 5 },
    { x: -2, z: 2, id: 6 },
    { x: 0, z: 2, id: 7 },
    { x: 2, z: 2, id: 8 }
  ];

  const handleOperatorClick = (operatorId: string) => {
    console.log("Operator clicked:", operatorId);
    setSelectedOperator(operatorId === selectedOperator ? null : operatorId);
  };

  return (
    <group ref={groupRef}>
      {/* Room floor and walls */}
      <Room />
      
      {/* Workstations */}
      {workstationPositions.map((pos) => {
        // Find operator at this workstation
        const operatorAtStation = operators.find(op => op.assignedWorkstation === pos.id.toString());
        // Check if that operator is working on an emergency
        const isActive = operatorAtStation ? 
          (operatorAtStation.status === 'busy' || operatorAtStation.status === 'responding') : 
          false;
        
        return (
          <Workstation
            key={pos.id}
            position={[pos.x, 0, pos.z]}
            workstationId={pos.id.toString()}
            isActive={isActive}
          />
        );
      })}
      
      {/* Operators */}
      {operators.map((operator) => {
        const workstation = workstationPositions.find(w => w.id.toString() === operator.assignedWorkstation);
        const position = workstation 
          ? [workstation.x - 0.5, 0, workstation.z] 
          : [operator.x, 0, operator.z];
          
        return (
          <Operator
            key={operator.id}
            operator={operator}
            position={position as [number, number, number]}
            isSelected={selectedOperator === operator.id}
            onClick={() => handleOperatorClick(operator.id)}
          />
        );
      })}
    </group>
  );
}
