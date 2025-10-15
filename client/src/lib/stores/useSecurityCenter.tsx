import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameStats {
  successRate: number;
  averageResponseTime: number;
  totalEmergencies: number;
  resolvedEmergencies: number;
}

export type RoomType = 'dispatch' | 'surveillance' | 'breakroom';

interface SecurityCenterState {
  selectedOperator: string | null;
  selectedWorkstation: string | null;
  currentRoom: RoomType;
  stats: GameStats;
  
  // Actions
  setSelectedOperator: (operatorId: string | null) => void;
  setSelectedWorkstation: (workstationId: string | null) => void;
  setCurrentRoom: (room: RoomType) => void;
  updateStats: (newStats: Partial<GameStats>) => void;
  resetGame: () => void;
}

const initialStats: GameStats = {
  successRate: 100,
  averageResponseTime: 0,
  totalEmergencies: 0,
  resolvedEmergencies: 0
};

export const useSecurityCenter = create<SecurityCenterState>()(
  subscribeWithSelector((set, get) => ({
    selectedOperator: null,
    selectedWorkstation: null,
    currentRoom: 'dispatch',
    stats: initialStats,
    
    setSelectedOperator: (operatorId) => {
      console.log("Selected operator:", operatorId);
      set({ selectedOperator: operatorId });
    },
    
    setSelectedWorkstation: (workstationId) => {
      console.log("Selected workstation:", workstationId);
      set({ selectedWorkstation: workstationId });
    },
    
    setCurrentRoom: (room) => {
      console.log("Switching to room:", room);
      set({ currentRoom: room });
    },
    
    updateStats: (newStats) => {
      set((state) => ({
        stats: { ...state.stats, ...newStats }
      }));
    },
    
    resetGame: () => {
      set({
        selectedOperator: null,
        selectedWorkstation: null,
        currentRoom: 'dispatch',
        stats: initialStats
      });
    }
  }))
);

// Subscribe to operator selection changes
useSecurityCenter.subscribe(
  (state) => state.selectedOperator,
  (selectedOperator) => {
    if (selectedOperator) {
      console.log(`Operator ${selectedOperator} selected`);
    }
  }
);
