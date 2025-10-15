import Room from "./Room";
import SurveillanceRoom from "./SurveillanceRoom";
import BreakRoom from "./BreakRoom";
import Operator from "./Operator";
import Workstation from "./Workstation";
import { useOperators } from "../hooks/useOperators";
import { useEmergencies } from "../hooks/useEmergencies";
import { useGameLoop } from "../hooks/useGameLoop";
import { useSecurityCenter } from "../lib/stores/useSecurityCenter";
import Terrain from "./Terrain";

export default function SecurityCenter() {
  const { operators, updateOperatorStatus, improveOperatorSkill } = useOperators();
  const { emergencies, resolveEmergency } = useEmergencies();
  const { selectedOperator, setSelectedOperator, currentRoom } = useSecurityCenter();

  // Game loop for automatic emergency handling
  useGameLoop({ emergencies, operators, updateOperatorStatus, resolveEmergency, improveOperatorSkill });

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

  // Render appropriate room based on current selection
  const renderRoom = () => {
    switch (currentRoom) {
      case 'surveillance':
        return <SurveillanceRoom />;
      case 'breakroom':
        return <BreakRoom />;
      case 'dispatch':
      default:
        return <Room />;
    }
  };

  return (
    <group rotation={[0, -0.35, 0]}>
      <Terrain />

      {/* Room floor and walls */}
      {renderRoom()}
      
      {/* Workstations - only in dispatch room */}
      {currentRoom === 'dispatch' && workstationPositions.map((pos) => {
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
