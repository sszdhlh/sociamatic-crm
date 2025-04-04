import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, EyeIcon, ClockIcon, BoltIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

type TriggerConditionType = 'ticket_created' | 'ticket_updated' | 'comment_added' | 'status_changed' | 'priority_changed' | 'assignee_changed';
type TriggerActionType = 'assign_ticket' | 'change_status' | 'change_priority' | 'add_tags' | 'remove_tags' | 'send_notification' | 'add_cc';

type TriggerCondition = {
  type: TriggerConditionType;
  value?: string;
};

type TriggerAction = {
  type: TriggerActionType;
  value?: string;
};

type Trigger = {
  id: string;
  name: string;
  description: string;
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  enabled: boolean;
  createdBy: string;
  createdAt: string;
  lastExecuted: string | null;
  executionCount: number;
};

export default function TriggersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  
  const [triggers, setTriggers] = useState<Trigger[]>([
    {
      id: '1',
      name: 'Auto-Assign New Tickets',
      description: 'Automatically assign new tickets to the support team',
      conditions: [
        { type: 'ticket_created' }
      ],
      actions: [
        { type: 'assign_ticket', value: 'Support Team' }
      ],
      enabled: true,
      createdBy: 'System Admin',
      createdAt: '2023-08-15',
      lastExecuted: '2023-10-22 14:35',
      executionCount: 342,
    },
    {
      id: '2',
      name: 'Urgent Ticket Escalation',
      description: 'Escalate urgent tickets to the manager and change priority',
      conditions: [
        { type: 'priority_changed', value: 'urgent' }
      ],
      actions: [
        { type: 'assign_ticket', value: 'Support Manager' },
        { type: 'add_tags', value: 'escalated' },
        { type: 'send_notification', value: 'manager_email' }
      ],
      enabled: true,
      createdBy: 'Support Lead',
      createdAt: '2023-09-05',
      lastExecuted: '2023-10-21 09:12',
      executionCount: 28,
    },
    {
      id: '3',
      name: 'Add Feedback Tag',
      description: 'Add feedback tag when customer adds a comment',
      conditions: [
        { type: 'comment_added', value: 'customer' }
      ],
      actions: [
        { type: 'add_tags', value: 'needs_response' }
      ],
      enabled: false,
      createdBy: 'Quality Assurance',
      createdAt: '2023-09-18',
      lastExecuted: '2023-10-15 16:45',
      executionCount: 156,
    },
    {
      id: '4',
      name: 'Close Resolved Tickets',
      description: 'Automatically close tickets that have been in resolved status for 3 days',
      conditions: [
        { type: 'status_changed', value: 'resolved' }
      ],
      actions: [
        { type: 'change_status', value: 'closed' }
      ],
      enabled: true,
      createdBy: 'System Admin',
      createdAt: '2023-07-20',
      lastExecuted: '2023-10-22 00:00',
      executionCount: 287,
    },
    {
      id: '5',
      name: 'Notify on High Priority',
      description: 'Send notification when ticket priority is set to high',
      conditions: [
        { type: 'priority_changed', value: 'high' }
      ],
      actions: [
        { type: 'send_notification', value: 'team_email' },
        { type: 'add_tags', value: 'high_priority' }
      ],
      enabled: true,
      createdBy: 'Support Manager',
      createdAt: '2023-10-01',
      lastExecuted: '2023-10-22 11:20',
      executionCount: 45,
    },
  ]);

  const getConditionLabel = (condition: TriggerCondition): string => {
    const typeLabels: Record<TriggerConditionType, string> = {
      ticket_created: 'Ticket is created',
      ticket_updated: 'Ticket is updated',
      comment_added: 'Comment is added',
      status_changed: 'Status changes',
      priority_changed: 'Priority changes',
      assignee_changed: 'Assignee changes',
    };
    
    let label = typeLabels[condition.type];
    
    if (condition.value) {
      switch (condition.type) {
        case 'comment_added':
          label += ` by ${condition.value}`;
          break;
        case 'status_changed':
          label += ` to ${condition.value}`;
          break;
        case 'priority_changed':
          label += ` to ${condition.value}`;
          break;
        case 'assignee_changed':
          label += ` to ${condition.value}`;
          break;
      }
    }
    
    return label;
  };

  const getActionLabel = (action: TriggerAction): string => {
    const typeLabels: Record<TriggerActionType, string> = {
      assign_ticket: 'Assign ticket',
      change_status: 'Change status',
      change_priority: 'Change priority',
      add_tags: 'Add tags',
      remove_tags: 'Remove tags',
      send_notification: 'Send notification',
      add_cc: 'Add CC',
    };
    
    let label = typeLabels[action.type];
    
    if (action.value) {
      switch (action.type) {
        case 'assign_ticket':
          label += ` to ${action.value}`;
          break;
        case 'change_status':
          label += ` to ${action.value}`;
          break;
        case 'change_priority':
          label += ` to ${action.value}`;
          break;
        case 'add_tags':
        case 'remove_tags':
          label += `: ${action.value}`;
          break;
        case 'send_notification':
          label += ` to ${action.value.replace('_', ' ')}`;
          break;
        case 'add_cc':
          label += `: ${action.value}`;
          break;
      }
    }
    
    return label;
  };

  const filteredTriggers = triggers.filter(trigger => {
    // Filter by search term
    const matchesSearch = 
      trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      trigger.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'enabled' && trigger.enabled) || 
      (statusFilter === 'disabled' && !trigger.enabled);
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteTrigger = (id: string) => {
    if (confirm('Are you sure you want to delete this trigger?')) {
      setTriggers(triggers.filter(trigger => trigger.id !== id));
    }
  };

  const handleToggleTrigger = (id: string) => {
    setTriggers(triggers.map(trigger => 
      trigger.id === id ? { ...trigger, enabled: !trigger.enabled } : trigger
    ));
  };

  return (
    <>
      <Head>
        <title>Trigger Rules | Sociamatic CRM</title>
        <meta name="description" content="Manage automation triggers and rules" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Trigger Rules</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <div className="w-full md:w-96 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search triggers by name or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'enabled' | 'disabled')}
                >
                  <option value="all">All Status</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
                
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create Trigger
                </button>
              </div>
            </div>

            {/* Triggers Table */}
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trigger
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conditions & Actions
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Executions
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTriggers.map((trigger) => (
                          <tr key={trigger.id}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{trigger.name}</div>
                              <div className="text-sm text-gray-500">{trigger.description}</div>
                              <div className="text-xs text-gray-400 mt-1">Created by {trigger.createdBy} on {trigger.createdAt}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="mb-2">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">When:</div>
                                <ul className="text-sm text-gray-700 list-disc list-inside">
                                  {trigger.conditions.map((condition, idx) => (
                                    <li key={idx}>{getConditionLabel(condition)}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Then:</div>
                                <ul className="text-sm text-gray-700 list-disc list-inside">
                                  {trigger.actions.map((action, idx) => (
                                    <li key={idx}>{getActionLabel(action)}</li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Switch
                                checked={trigger.enabled}
                                onChange={() => handleToggleTrigger(trigger.id)}
                                className={`${trigger.enabled ? 'bg-primary-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Enable trigger</span>
                                <span
                                  className={`${trigger.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                              <span className="ml-2 text-sm text-gray-500">
                                {trigger.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <BoltIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">{trigger.executionCount} times</span>
                              </div>
                              {trigger.lastExecuted && (
                                <div className="flex items-center mt-1">
                                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-xs text-gray-400">Last: {trigger.lastExecuted}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <button
                                  type="button"
                                  className="text-primary-600 hover:text-primary-900"
                                  title="Edit trigger"
                                >
                                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  className="text-blue-600 hover:text-blue-900"
                                  title="View logs"
                                >
                                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete trigger"
                                  onClick={() => handleDeleteTrigger(trigger.id)}
                                >
                                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {filteredTriggers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No triggers found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}