import { useEffect } from 'react';
import { Emergency } from './useEmergencies';
import { OperatorData } from '../components/Operator';

interface GameLoopProps {
  emergencies: Emergency[];
  operators: OperatorData[];
  updateOperatorStatus: (operatorId: string, status: OperatorData['status']) => void;
  resolveEmergency: (emergencyId: string, resolution: 'resolved' | 'failed') => void;
}

interface EmergencyProgress {
  emergencyId: string;
  operatorId: string;
  startTime: number;
  requiredTime: number;
}

const activeHandling: Map<string, EmergencyProgress> = new Map();

// Calculate how long an emergency should take based on priority and operator experience
function calculateHandlingTime(priority: string, operatorExperience: number): number {
  const baseTimes = {
    'low': 10000,      // 10 seconds
    'medium': 15000,   // 15 seconds
    'high': 20000,     // 20 seconds
    'critical': 25000  // 25 seconds
  };
  
  const baseTime = baseTimes[priority as keyof typeof baseTimes] || 15000;
  
  // Better operators (higher experience) handle emergencies faster
  // Experience ranges from 50-100, so this gives 0.5x to 1.0x multiplier
  const experienceMultiplier = 1.5 - (operatorExperience / 100);
  
  return Math.floor(baseTime * experienceMultiplier);
}

// Calculate success chance based on operator experience and emergency priority
function calculateSuccessChance(priority: string, operatorExperience: number): number {
  const baseChances = {
    'low': 0.95,
    'medium': 0.85,
    'high': 0.75,
    'critical': 0.65
  };
  
  const baseChance = baseChances[priority as keyof typeof baseChances] || 0.8;
  
  // Higher experience increases success chance
  const experienceBonus = (operatorExperience - 50) / 200; // 0 to 0.25 bonus
  
  return Math.min(0.98, baseChance + experienceBonus);
}

export function useGameLoop({ emergencies, operators, updateOperatorStatus, resolveEmergency }: GameLoopProps) {
  
  useEffect(() => {
    // Check for newly assigned emergencies
    emergencies.forEach(emergency => {
      if (emergency.status === 'assigned' && emergency.assignedOperator && !activeHandling.has(emergency.id)) {
        const operator = operators.find(op => op.id === emergency.assignedOperator);
        
        if (operator) {
          // Start handling the emergency
          const requiredTime = calculateHandlingTime(emergency.priority, operator.experience);
          
          activeHandling.set(emergency.id, {
            emergencyId: emergency.id,
            operatorId: operator.id,
            startTime: Date.now(),
            requiredTime
          });
          
          // Update operator status to responding
          updateOperatorStatus(operator.id, 'responding');
          
          console.log(`Operator ${operator.name} started handling ${emergency.type} (${requiredTime}ms required)`);
        }
      }
    });
    
    // Process active emergencies
    const interval = setInterval(() => {
      const now = Date.now();
      
      activeHandling.forEach((progress, emergencyId) => {
        const emergency = emergencies.find(e => e.id === emergencyId);
        const operator = operators.find(op => op.id === progress.operatorId);
        
        // Check if emergency still exists and is assigned
        if (!emergency || emergency.status !== 'assigned' || !operator) {
          activeHandling.delete(emergencyId);
          if (operator) {
            updateOperatorStatus(operator.id, 'idle');
          }
          return;
        }
        
        // Check if handling time is complete
        const elapsed = now - progress.startTime;
        if (elapsed >= progress.requiredTime) {
          // Determine success or failure
          const successChance = calculateSuccessChance(emergency.priority, operator.experience);
          const success = Math.random() < successChance;
          
          // Resolve the emergency
          resolveEmergency(emergencyId, success ? 'resolved' : 'failed');
          
          // Set operator back to idle
          updateOperatorStatus(operator.id, 'idle');
          
          // Remove from active handling
          activeHandling.delete(emergencyId);
          
          console.log(`Emergency ${emergency.type} ${success ? 'resolved' : 'failed'} by ${operator.name}`);
        } else {
          // Update operator to busy while processing
          if (operator.status !== 'busy') {
            updateOperatorStatus(operator.id, 'busy');
          }
        }
      });
    }, 1000); // Check every second
    
    return () => clearInterval(interval);
  }, [emergencies, operators, updateOperatorStatus, resolveEmergency]);
  
  // Clean up resolved/failed emergencies from active handling
  useEffect(() => {
    emergencies.forEach(emergency => {
      if ((emergency.status === 'resolved' || emergency.status === 'failed') && activeHandling.has(emergency.id)) {
        const progress = activeHandling.get(emergency.id);
        if (progress) {
          updateOperatorStatus(progress.operatorId, 'idle');
          activeHandling.delete(emergency.id);
        }
      }
    });
  }, [emergencies, updateOperatorStatus]);
}
