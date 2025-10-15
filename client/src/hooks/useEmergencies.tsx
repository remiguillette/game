import { useState, useEffect, useMemo } from 'react';
import { useSecurityCenter } from '../lib/stores/useSecurityCenter';

export interface Emergency {
  id: string;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'assigned' | 'resolved' | 'failed';
  createdAt: number;
  assignedOperator?: string;
  resolutionTime?: number;
}

const EMERGENCY_TYPES = [
  {
    type: 'Fire Alert',
    descriptions: [
      'Smoke detected in building A, floor 3',
      'Fire alarm triggered in parking garage',
      'Heat sensor activated in server room'
    ],
    priority: ['medium', 'high', 'critical'] as const
  },
  {
    type: 'Medical Emergency', 
    descriptions: [
      'Person collapsed in lobby area',
      'Medical assistance requested in elevator',
      'Heart attack reported in cafeteria'
    ],
    priority: ['high', 'critical'] as const
  },
  {
    type: 'Security Breach',
    descriptions: [
      'Unauthorized access detected in restricted area',
      'Multiple failed login attempts on system',
      'Suspicious activity on camera 7'
    ],
    priority: ['medium', 'high'] as const
  },
  {
    type: 'Technical Failure',
    descriptions: [
      'Elevator stuck between floors 2 and 3',
      'Power outage in east wing',
      'Network connection lost to building B'
    ],
    priority: ['low', 'medium'] as const
  },
  {
    type: 'Noise Complaint',
    descriptions: [
      'Loud music reported from office 203',
      'Construction noise exceeding limits',
      'Neighbor complaint about late night activity'
    ],
    priority: ['low'] as const
  }
];

export function useEmergencies() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const { updateStats } = useSecurityCenter();

  // Pre-calculate random emergency generation data
  const emergencyData = useMemo(() => {
    return EMERGENCY_TYPES.map(type => ({
      ...type,
      shuffledDescriptions: [...type.descriptions].sort(() => Math.random() - 0.5),
      shuffledPriorities: [...type.priority].sort(() => Math.random() - 0.5)
    }));
  }, []);

  // Generate random emergency
  const generateEmergency = useMemo(() => {
    let emergencyIndex = 0;
    let descriptionIndex = 0;
    
    return () => {
      const typeData = emergencyData[emergencyIndex % emergencyData.length];
      const description = typeData.shuffledDescriptions[descriptionIndex % typeData.shuffledDescriptions.length];
      const priority = typeData.shuffledPriorities[0]; // Use first priority for consistency
      
      emergencyIndex++;
      descriptionIndex++;
      
      const emergency: Emergency = {
        id: `emergency-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: typeData.type,
        description,
        priority,
        status: 'active',
        createdAt: Date.now()
      };
      
      return emergency;
    };
  }, [emergencyData]);

  // Generate emergencies at random intervals
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate emergency with 30% chance every 5 seconds
      if (Math.random() < 0.3 && emergencies.length < 8) {
        const newEmergency = generateEmergency();
        setEmergencies(prev => [...prev, newEmergency]);
        console.log('New emergency generated:', newEmergency.type);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [emergencies.length, generateEmergency]);

  // Auto-resolve old emergencies
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setEmergencies(prev => 
        prev.map(emergency => {
          if (emergency.status === 'active' && now - emergency.createdAt > 60000) {
            // Auto-fail emergencies older than 60 seconds
            return { ...emergency, status: 'failed' as const, resolutionTime: 60 };
          }
          return emergency;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const assignOperator = (emergencyId: string, operatorId: string) => {
    setEmergencies(prev =>
      prev.map(emergency =>
        emergency.id === emergencyId
          ? { ...emergency, status: 'assigned', assignedOperator: operatorId }
          : emergency
      )
    );
    console.log(`Emergency ${emergencyId} assigned to operator ${operatorId}`);
  };

  const resolveEmergency = (emergencyId: string, resolution: 'resolved' | 'failed') => {
    setEmergencies(prev => {
      const updated = prev.map(emergency => {
        if (emergency.id === emergencyId) {
          const resolutionTime = Math.floor((Date.now() - emergency.createdAt) / 1000);
          return { 
            ...emergency, 
            status: resolution, 
            resolutionTime 
          };
        }
        return emergency;
      });
      
      // Update stats
      const resolved = updated.find(e => e.id === emergencyId);
      if (resolved) {
        const totalEmergencies = updated.length;
        const resolvedCount = updated.filter(e => e.status === 'resolved').length;
        const avgResponseTime = Math.floor(
          updated
            .filter(e => e.resolutionTime)
            .reduce((sum, e) => sum + (e.resolutionTime || 0), 0) /
          updated.filter(e => e.resolutionTime).length || 1
        );
        
        updateStats({
          successRate: Math.floor((resolvedCount / totalEmergencies) * 100),
          averageResponseTime: avgResponseTime
        });
      }
      
      return updated;
    });
    
    console.log(`Emergency ${emergencyId} ${resolution}`);
  };

  return {
    emergencies,
    assignOperator,
    resolveEmergency,
    generateEmergency
  };
}
