import { useState } from 'react';
import { CogIcon, UserPlusIcon, UserMinusIcon, ArrowUpCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

type AutomationRequest = {
  id: string;
  type: 'add_user' | 'remove_user' | 'upgrade_plan' | 'downgrade_plan' | 'enable_ai';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  details: string;
  created_at: string;
};

export default function AutomationCard() {
  const [activeTab, setActiveTab] = useState<'actions' | 'history'>('actions');
  const [processing, setProcessing] = useState(false);
  const [requests, setRequests] = useState<AutomationRequest[]>([
    {
      id: 'req-001',
      type: 'add_user',
      status: 'completed',
      details: 'Add user: marketing@example.com',
      created_at: '2023-10-14T10:30:00Z',
    },
    {
      id: 'req-002',
      type: 'upgrade_plan',
      status: 'completed',
      details: 'Upgrade to Enterprise Plan',
      created_at: '2023-10-13T14:45:00Z',
    },
    {
      id: 'req-003',
      type: 'enable_ai',
      status: 'failed',
      details: 'Enable AI Assistant feature',
      created_at: '2023-10-15T09:15:00Z',
    },
  ]);

  const handleAction = (type: AutomationRequest['type'], details: string) => {
    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRequest: AutomationRequest = {
        id: `req-${Math.floor(Math.random() * 1000)}`,
        type,
        status: 'completed',
        details,
        created_at: new Date().toISOString(),
      };
      
      setRequests([newRequest, ...requests]);
      setProcessing(false);
      setActiveTab('history');
    }, 1500);
  };

  const getStatusColor = (status: AutomationRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: AutomationRequest['type']) => {
    switch (type) {
      case 'add_user':
        return <UserPlusIcon className="h-5 w-5" />;
      case 'remove_user':
        return <UserMinusIcon className="h-5 w-5" />;
      case 'upgrade_plan':
      case 'downgrade_plan':
        return <ArrowUpCircleIcon className={`h-5 w-5 ${type === 'downgrade_plan' ? 'transform rotate-180' : ''}`} />;
      case 'enable_ai':
        return <SparklesIcon className="h-5 w-5" />;
      default:
        return <CogIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Automation Operations</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${activeTab === 'actions' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${activeTab === 'history' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'actions' && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAction('add_user', 'Add user: support@example.com')}
            disabled={processing}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserPlusIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium">Add User</span>
          </button>
          
          <button
            onClick={() => handleAction('remove_user', 'Remove user: inactive@example.com')}
            disabled={processing}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserMinusIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium">Remove User</span>
          </button>
          
          <button
            onClick={() => handleAction('upgrade_plan', 'Upgrade to Enterprise Plan')}
            disabled={processing}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowUpCircleIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium">Upgrade Plan</span>
          </button>
          
          <button
            onClick={() => handleAction('enable_ai', 'Enable AI Assistant feature')}
            disabled={processing}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SparklesIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium">Enable AI Assistant</span>
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="overflow-hidden">
          {requests.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No operation history</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {requests.map((request) => (
                <li key={request.id} className="py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-primary-600">
                      {getTypeIcon(request.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{request.details}</p>
                      <p className="text-xs text-gray-500">{formatDate(request.created_at)}</p>
                    </div>
                    <div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status === 'pending' ? 'Pending' : 
                         request.status === 'processing' ? 'Processing' : 
                         request.status === 'completed' ? 'Completed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {processing && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="ml-2">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}