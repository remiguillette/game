import { useState, useMemo } from 'react';
import { OperatorData, OperatorSpecialty } from '../components/Operator';

const OPERATOR_NAMES = [
  'Alex Chen', 'Jordan Smith', 'Taylor Davis', 'Morgan Lee',
  'Casey Johnson', 'Riley Wilson', 'Avery Brown', 'Quinn Martinez'
];

const SPECIALTIES: OperatorSpecialty[] = ['fire', 'medical', 'security', 'technical', 'fire', 'medical', 'security', 'general'];

export function useOperators() {
  // Pre-generate operator data to avoid random values in render
  const initialOperators = useMemo<OperatorData[]>(() => {
    return OPERATOR_NAMES.map((name, index) => {
      const specialty = SPECIALTIES[index];
      
      // Base skill level for all skills (30-50)
      const baseSkill = Math.floor(Math.random() * 20) + 30;
      
      // Specialty skill is higher (60-80)
      const specialtySkill = Math.floor(Math.random() * 20) + 60;
      
      return {
        id: `operator-${index + 1}`,
        name,
        status: 'idle' as const,
        experience: Math.floor(Math.random() * 40) + 50, // 50-90% experience
        specialty,
        skills: {
          fire: specialty === 'fire' ? specialtySkill : baseSkill,
          medical: specialty === 'medical' ? specialtySkill : baseSkill,
          security: specialty === 'security' ? specialtySkill : baseSkill,
          technical: specialty === 'technical' ? specialtySkill : baseSkill
        },
        assignedWorkstation: (index + 1).toString(),
        x: 0,
        z: 0
      };
    });
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

  const improveOperatorSkill = (operatorId: string, skillType: keyof OperatorData['skills'], amount: number = 2) => {
    setOperators(prev =>
      prev.map(operator => {
        if (operator.id === operatorId) {
          const currentSkill = operator.skills[skillType];
          const newSkill = Math.min(100, currentSkill + amount); // Cap at 100
          
          return {
            ...operator,
            skills: {
              ...operator.skills,
              [skillType]: newSkill
            },
            experience: Math.min(100, operator.experience + 1) // Also improve general experience slightly
          };
        }
        return operator;
      })
    );
  };

  return {
    operators,
    updateOperatorStatus,
    assignOperatorToWorkstation,
    improveOperatorSkill,
    getAvailableOperators,
    getBusyOperators
  };
}
