import { useState, useMemo } from 'react';
import { OperatorData } from '../components/Operator';

const OPERATOR_NAMES = [
  'Alex Chen', 'Jordan Smith', 'Taylor Davis', 'Morgan Lee',
  'Casey Johnson', 'Riley Wilson', 'Avery Brown', 'Quinn Martinez'
];

export function useOperators() {
  // Pre-generate operator data to avoid random values in render
  const initialOperators = useMemo<OperatorData[]>(() => {
    return OPERATOR_NAMES.map((name, index) => ({
      id: `operator-${index + 1}`,
      name,
      status: 'idle' as const,
      experience: Math.floor(Math.random() * 40) + 50, // 50-90% experience
      assignedWorkstation: (index + 1).toString(),
      x: 0, // Will be positioned by workstation
      z: 0
    }));
  }, []);

  const [operators, setOperators] = useState<OperatorData[]>(initialOperators);

  const updateOperatorStatus = (operatorId: string, status: OperatorData['status']) => {
    setOperators(prev =>
      prev.map(operator =>
        operator.id === operatorId ? { ...operator, status } : operator
      )
    );
  };

  const assignOperatorToWorkstation = (operatorId: string, workstationId: string) => {
    setOperators(prev =>
      prev.map(operator =>
        operator.id === operatorId 
          ? { ...operator, assignedWorkstation: workstationId }
          : operator
      )
    );
  };

  const getAvailableOperators = () => {
    return operators.filter(op => op.status === 'idle');
  };

  const getBusyOperators = () => {
    return operators.filter(op => op.status === 'busy' || op.status === 'responding');
  };

  return {
    operators,
    updateOperatorStatus,
    assignOperatorToWorkstation,
    getAvailableOperators,
    getBusyOperators
  };
}
