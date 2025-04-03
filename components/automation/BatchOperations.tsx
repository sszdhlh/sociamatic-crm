import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

type BatchOperation = {
  id: string;
  type: 'add_user' | 'remove_user' | 'upgrade_plan' | 'downgrade_plan' | 'enable_ai';
  details: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
};

type BatchOperationsProps = {
  onSubmit: (operations: BatchOperation[]) => void;
  processing: boolean;
};

export default function BatchOperations({ onSubmit, processing }: BatchOperationsProps) {
  const [operations, setOperations] = useState<BatchOperation[]>([]);
  const [currentType, setCurrentType] = useState<BatchOperation['type']>('add_user');
  const [currentDetails, setCurrentDetails] = useState('');

  const addOperation = () => {
    if (!currentDetails.trim()) return;
    
    const newOperation: BatchOperation = {
      id: `op-${Date.now()}`,
      type: currentType,
      details: currentDetails,
      status: 'pending'
    };
    
    setOperations([...operations, newOperation]);
    setCurrentDetails('');
  };

  const removeOperation = (id: string) => {
    setOperations(operations.filter(op => op.id !== id));
  };

  const handleSubmit = () => {
    if (operations.length === 0) return;
    onSubmit(operations);
    setOperations([]);
  };

  const getTypeName = (type: BatchOperation['type']) => {
    switch (type) {
      case 'add_user': return 'Add User';
      case 'remove_user': return 'Remove User';
      case 'upgrade_plan': return 'Upgrade Plan';
      case 'downgrade_plan': return 'Downgrade Plan';
      case 'enable_ai': return 'Enable AI Assistant';
      default: return 'Unknown Operation';
    }
  };

  return (
    <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Batch Operations</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add multiple operations and execute them at once to improve efficiency
        </p>
      </div>

      <div className="p-4">
        <div className="flex space-x-3">
          <select
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value as BatchOperation['type'])}
            className="input max-w-xs"
          >
            <option value="add_user">Add User</option>
            <option value="remove_user">Remove User</option>
            <option value="upgrade_plan">Upgrade Plan</option>
            <option value="downgrade_plan">Downgrade Plan</option>
            <option value="enable_ai">Enable AI Assistant</option>
          </select>
          
          <input
            type="text"
            value={currentDetails}
            onChange={(e) => setCurrentDetails(e.target.value)}
            placeholder="Enter operation details"
            className="input flex-1"
          />
          
          <button
            onClick={addOperation}
            disabled={!currentDetails.trim()}
            className="btn-outline"
          >
            Add
          </button>
        </div>

        {operations.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Pending Operations</h3>
            <ul className="border rounded-md divide-y divide-gray-200">
              {operations.map((op) => (
                <li key={op.id} className="p-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{getTypeName(op.type)}: </span>
                    <span className="text-gray-700">{op.details}</span>
                  </div>
                  <button
                    onClick={() => removeOperation(op.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={processing || operations.length === 0}
                className="btn-primary flex items-center"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>Execute All Operations ({operations.length})</>  
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}