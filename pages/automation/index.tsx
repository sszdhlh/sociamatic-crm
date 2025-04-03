import { useState, useRef } from 'react';
import Head from 'next/head';
import { CogIcon, UserPlusIcon, UserMinusIcon, ArrowUpCircleIcon, SparklesIcon, ArrowPathIcon, FunnelIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import BatchOperations from '@/components/automation/BatchOperations';

type AutomationRequest = {
  id: string;
  type: 'add_user' | 'remove_user' | 'upgrade_plan' | 'downgrade_plan' | 'enable_ai';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  details: string;
  created_at: string;
  user?: string;
};

export default function Automation() {
  const [activeTab, setActiveTab] = useState<'actions' | 'history' | 'batch'>('actions');
  const [processing, setProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AutomationRequest['type'] | null>(null);
  const [actionDetails, setActionDetails] = useState('');
  const [filterStatus, setFilterStatus] = useState<AutomationRequest['status'] | 'all'>('all');
  const [filterType, setFilterType] = useState<AutomationRequest['type'] | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const exportRef = useRef<HTMLAnchorElement>(null);
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
      details: 'Enable AI Assistant',
      created_at: '2023-10-15T09:15:00Z',
    },
    {
      id: 'req-004',
      type: 'remove_user',
      status: 'completed',
      details: 'Remove user: inactive@example.com',
      created_at: '2023-10-12T16:20:00Z',
    },
    {
      id: 'req-005',
      type: 'downgrade_plan',
      status: 'pending',
      details: 'Downgrade to Team Plan',
      created_at: '2023-10-15T11:05:00Z',
    },
  ]);

  const handleSelectAction = (type: AutomationRequest['type']) => {
    setSelectedAction(type);
    
    // Set default details based on operation type
    switch (type) {
      case 'add_user':
        setActionDetails('Add user: ');
        break;
      case 'remove_user':
        setActionDetails('Remove user: ');
        break;
      case 'upgrade_plan':
        setActionDetails('Upgrade to Enterprise Plan');
        break;
      case 'downgrade_plan':
        setActionDetails('Downgrade to Team Plan');
        break;
      case 'enable_ai':
        setActionDetails('Enable AI Assistant');
        break;
      default:
        setActionDetails('');
    }
  };

  const handleSubmitAction = () => {
    if (!selectedAction || !actionDetails) return;
    
    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRequest: AutomationRequest = {
        id: `req-${Math.floor(Math.random() * 1000)}`,
        type: selectedAction,
        status: 'completed',
        details: actionDetails,
        created_at: new Date().toISOString(),
      };
      
      setRequests([newRequest, ...requests]);
      setProcessing(false);
      setSelectedAction(null);
      setActionDetails('');
      setActiveTab('history');
    }, 1500);
  };

  const handleRefresh = () => {
    // Simulate refresh request history
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
    }, 1000);
  };
  
  const handleBatchOperations = (operations: { type: AutomationRequest['type']; details: string }[]) => {
    setProcessing(true);
    
    // Process batch operations
    setTimeout(() => {
      const newRequests: AutomationRequest[] = operations.map(op => ({
        id: `req-${Math.floor(Math.random() * 1000)}`,
        type: op.type,
        status: 'completed',
        details: op.details,
        created_at: new Date().toISOString()
      }));
      
      setRequests([...newRequests, ...requests]);
      setProcessing(false);
      setActiveTab('history');
    }, 2000);
  };
  
  const handleExportLogs = () => {
    // Create CSV content
    const headers = ['Operation ID', 'Type', 'Details', 'Status', 'Execution Time'];
    const csvContent = [
      headers.join(','),
      ...requests.map(req => [
        req.id,
        getActionName(req.type),
        `"${req.details.replace(/"/g, '""')}"`,
        req.status === 'pending' ? 'Pending' : 
        req.status === 'processing' ? 'Processing' : 
        req.status === 'completed' ? 'Completed' : 'Failed',
        formatDate(req.created_at)
      ].join(','))
    ].join('\n');
    
    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    if (exportRef.current) {
      exportRef.current.href = url;
      exportRef.current.download = `sociamatic-automation-logs-${new Date().toISOString().split('T')[0]}.csv`;
      exportRef.current.click();
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };
  
  const filteredRequests = requests.filter(req => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (filterType !== 'all' && req.type !== filterType) return false;
    return true;
  });

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

  const getActionName = (type: AutomationRequest['type']) => {
    switch (type) {
      case 'add_user':
        return 'Add User';
      case 'remove_user':
        return 'Remove User';
      case 'upgrade_plan':
        return 'Upgrade Plan';
      case 'downgrade_plan':
        return 'Downgrade Plan';
      case 'enable_ai':
        return 'Enable AI Assistant';
      default:
        return 'Unknown Operation';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="py-6">
      <Head>
        <title>Automation | Sociamatic Smart Self-Service Portal</title>
        <meta name="description" content="Execute Sociamatic automation operations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Automation</h1>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-md ${activeTab === 'actions' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('actions')}
            >
              Action Center
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${activeTab === 'batch' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('batch')}
            >
              Batch Operations
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
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Select Operation</h2>
              <p className="mt-1 text-sm text-gray-500">
                Execute common Sociamatic management operations without submitting tickets
              </p>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[
                  { type: 'add_user', icon: UserPlusIcon, label: 'Add User' },
                  { type: 'remove_user', icon: UserMinusIcon, label: 'Remove User' },
                  { type: 'upgrade_plan', icon: ArrowUpCircleIcon, label: 'Upgrade Plan' },
                  { type: 'downgrade_plan', icon: ArrowUpCircleIcon, label: 'Downgrade Plan', rotate: true },
                  { type: 'enable_ai', icon: SparklesIcon, label: 'Enable AI Assistant' },
                ].map((action) => (
                  <button
                    key={action.type}
                    onClick={() => handleSelectAction(action.type as AutomationRequest['type'])}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${selectedAction === action.type ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <action.icon className={`h-8 w-8 text-primary-600 mb-2 ${action.rotate ? 'transform rotate-180' : ''}`} />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>

              {selectedAction && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    {getActionName(selectedAction)} Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="action-details" className="block text-sm font-medium text-gray-700">
                        Details
                      </label>
                      <input
                        type="text"
                        id="action-details"
                        className="mt-1 input"
                        value={actionDetails}
                        onChange={(e) => setActionDetails(e.target.value)}
                        placeholder="Enter operation details"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => {
                          setSelectedAction(null);
                          setActionDetails('');
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleSubmitAction}
                        disabled={!actionDetails || processing}
                      >
                        {processing ? 'Processing...' : 'Execute Operation'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <BatchOperations onSubmit={handleBatchOperations} processing={processing} />
        )}

        {activeTab === 'history' && (
          <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Operation History</h2>
                <p className="mt-1 text-sm text-gray-500">
                  View execution records and status of all automation operations
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-outline flex items-center"
                >
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filter
                </button>
                <button
                  onClick={handleExportLogs}
                  className="btn-outline flex items-center"
                  disabled={requests.length === 0}
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Export
                </button>
                <button
                  onClick={handleRefresh}
                  className="btn-outline flex items-center"
                  disabled={processing}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${processing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              <a ref={exportRef} className="hidden"></a>
            </div>
            
            {showFilters && (
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4">
                <div>
                  <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Status
                  </label>
                  <select
                    id="filter-status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="input max-w-xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Type
                  </label>
                  <select
                    id="filter-type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="input max-w-xs"
                  >
                    <option value="all">All Types</option>
                    <option value="add_user">Add User</option>
                    <option value="remove_user">Remove User</option>
                    <option value="upgrade_plan">Upgrade Plan</option>
                    <option value="downgrade_plan">Downgrade Plan</option>
                    <option value="enable_ai">Enable AI Assistant</option>
                  </select>
                </div>
              </div>
            )}

            <div className="overflow-hidden">
              {filteredRequests.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No operation history</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Operation Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Execution Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 text-primary-600">
                                {getTypeIcon(request.type)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {getActionName(request.type)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{request.details}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(request.created_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status === 'pending' ? 'Pending' : 
                               request.status === 'processing' ? 'Processing' : 
                               request.status === 'completed' ? 'Completed' : 'Failed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}