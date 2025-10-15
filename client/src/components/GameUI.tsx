import { useEmergencies } from "../hooks/useEmergencies";
import { useOperators } from "../hooks/useOperators";
import { useSecurityCenter } from "../lib/stores/useSecurityCenter";
import { useGame } from "../lib/stores/useGame";

export default function GameUI() {
  const { emergencies, resolveEmergency, assignOperator } = useEmergencies();
  const { operators } = useOperators();
  const { selectedOperator, stats } = useSecurityCenter();
  const { phase } = useGame();

  const activeEmergencies = emergencies.filter(e => e.status === 'active');
  const selectedOp = operators.find(op => op.id === selectedOperator);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Game Stats - Top Left */}
      <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg pointer-events-auto min-w-64">
        <h2 className="text-lg font-bold mb-2 text-green-400">Security Center Control</h2>
        <div className="space-y-1 text-sm">
          <div>Status: <span className="text-blue-400">{phase}</span></div>
          <div>Active Emergencies: <span className="text-red-400">{activeEmergencies.length}</span></div>
          <div>Total Operators: <span className="text-green-400">{operators.length}</span></div>
          <div>Success Rate: <span className="text-yellow-400">{stats.successRate}%</span></div>
          <div>Response Time: <span className="text-blue-400">{stats.averageResponseTime}s</span></div>
        </div>
      </div>

      {/* Active Emergencies - Top Right */}
      <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg pointer-events-auto max-w-80">
        <h3 className="text-md font-bold mb-2 text-red-400">Active Emergencies</h3>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {activeEmergencies.length === 0 ? (
            <p className="text-gray-400 text-sm">No active emergencies</p>
          ) : (
            activeEmergencies.map((emergency) => {
              const assignedOp = operators.find(op => op.id === emergency.assignedOperator);
              
              return (
                <div key={emergency.id} className="bg-gray-800 p-3 rounded border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-red-300">{emergency.type}</h4>
                      <p className="text-xs text-gray-300 mt-1">{emergency.description}</p>
                      <div className="mt-2 text-xs">
                        <span className="text-yellow-400">Priority: {emergency.priority}</span>
                        <span className="text-blue-400 ml-3">
                          Time: {Math.floor((Date.now() - emergency.createdAt) / 1000)}s
                        </span>
                      </div>
                      {assignedOp && (
                        <p className="text-green-400 text-xs mt-1">
                          Assigned to: {assignedOp.name}
                        </p>
                      )}
                    </div>
                    <div className="space-x-1">
                      {selectedOperator && !emergency.assignedOperator && (
                        <button
                          onClick={() => assignOperator(emergency.id, selectedOperator)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                        >
                          Assign
                        </button>
                      )}
                      <button
                        onClick={() => resolveEmergency(emergency.id, 'resolved')}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Operator Info - Bottom Left */}
      {selectedOp && (
        <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg pointer-events-auto">
          <h3 className="text-md font-bold mb-2 text-blue-400">Selected Operator</h3>
          <div className="space-y-1 text-sm">
            <div>Name: <span className="text-green-400">{selectedOp.name}</span></div>
            <div>Status: <span className={`${
              selectedOp.status === 'idle' ? 'text-green-400' :
              selectedOp.status === 'busy' ? 'text-red-400' : 'text-yellow-400'
            }`}>{selectedOp.status}</span></div>
            <div>Experience: <span className="text-blue-400">{selectedOp.experience}%</span></div>
            <div>Workstation: <span className="text-purple-400">
              {selectedOp.assignedWorkstation || 'Unassigned'}
            </span></div>
          </div>
        </div>
      )}

      {/* Controls Help - Bottom Right */}
      <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg pointer-events-auto">
        <h3 className="text-sm font-bold mb-2 text-gray-300">Controls</h3>
        <div className="text-xs space-y-1 text-gray-400">
          <div>Click operator to select</div>
          <div>WASD / Arrow keys to move camera</div>
          <div>Space/Enter to confirm assignment</div>
          <div>ESC to cancel selection</div>
        </div>
      </div>
    </div>
  );
}
