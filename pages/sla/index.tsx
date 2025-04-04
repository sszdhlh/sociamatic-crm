import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, ClockIcon, BoltIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

type SLAConditionType = 'priority' | 'channel' | 'tags' | 'customer_type' | 'organization';
type SLATargetType = 'first_response' | 'next_response' | 'resolution' | 'agent_work';

type SLACondition = {
  type: SLAConditionType;
  value: string;
};

type SLATarget = {
  type: SLATargetType;
  hours: number;
  minutes: number;
};

type BusinessHours = {
  name: string;
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  startTime: string;
  endTime: string;
  timezone: string;
};

type SLAPolicy = {
  id: string;
  name: string;
  description: string;
  conditions: SLACondition[];
  targets: SLATarget[];
  businessHours: string;
  enabled: boolean;
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
};

export default function SLAManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    {
      name: 'Standard Business Hours',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'UTC-5 (Eastern Time)',
    },
    {
      name: '24/7 Support',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      startTime: '00:00',
      endTime: '23:59',
      timezone: 'UTC+0 (GMT)',
    },
    {
      name: 'Extended Hours',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '20:00',
      timezone: 'UTC-8 (Pacific Time)',
    },
  ]);
  
  const [slaPolicies, setSLAPolicies] = useState<SLAPolicy[]>([
    {
      id: '1',
      name: 'Enterprise Support',
      description: 'SLA policy for enterprise customers with priority support',
      conditions: [
        { type: 'customer_type', value: 'enterprise' },
        { type: 'priority', value: 'high,urgent' },
      ],
      targets: [
        { type: 'first_response', hours: 1, minutes: 0 },
        { type: 'resolution', hours: 8, minutes: 0 },
      ],
      businessHours: 'Standard Business Hours',
      enabled: true,
      createdBy: 'System Admin',
      createdAt: '2023-09-15',
      lastUpdated: '2023-10-01',
    },
    {
      id: '2',
      name: 'Standard Support',
      description: 'Default SLA policy for all customers',
      conditions: [],
      targets: [
        { type: 'first_response', hours: 4, minutes: 0 },
        { type: 'next_response', hours: 8, minutes: 0 },
        { type: 'resolution', hours: 24, minutes: 0 },
      ],
      businessHours: 'Standard Business Hours',
      enabled: true,
      createdBy: 'Support Manager',
      createdAt: '2023-08-10',
      lastUpdated: '2023-09-22',
    },
    {
      id: '3',
      name: 'Premium Support',
      description: 'SLA policy for premium customers',
      conditions: [
        { type: 'tags', value: 'premium,vip' },
      ],
      targets: [
        { type: 'first_response', hours: 2, minutes: 0 },
        { type: 'resolution', hours: 12, minutes: 0 },
      ],
      businessHours: 'Extended Hours',
      enabled: true,
      createdBy: 'Customer Success Manager',
      createdAt: '2023-09-05',
      lastUpdated: '2023-10-10',
    },
    {
      id: '4',
      name: 'Critical Issues',
      description: 'SLA policy for critical system issues',
      conditions: [
        { type: 'priority', value: 'urgent' },
        { type: 'tags', value: 'system-critical' },
      ],
      targets: [
        { type: 'first_response', hours: 0, minutes: 30 },
        { type: 'next_response', hours: 2, minutes: 0 },
        { type: 'resolution', hours: 4, minutes: 0 },
      ],
      businessHours: '24/7 Support',
      enabled: true,
      createdBy: 'System Admin',
      createdAt: '2023-07-20',
      lastUpdated: '2023-09-15',
    },
    {
      id: '5',
      name: 'Email Channel',
      description: 'SLA policy for tickets received via email',
      conditions: [
        { type: 'channel', value: 'email' },
      ],
      targets: [
        { type: 'first_response', hours: 6, minutes: 0 },
        { type: 'resolution', hours: 48, minutes: 0 },
      ],
      businessHours: 'Standard Business Hours',
      enabled: false,
      createdBy: 'Support Lead',
      createdAt: '2023-10-01',
      lastUpdated: '2023-10-15',
    },
  ]);

  const getConditionLabel = (condition: SLACondition): string => {
    const typeLabels: Record<SLAConditionType, string> = {
      priority: 'Priority',
      channel: 'Channel',
      tags: 'Tags',
      customer_type: 'Customer Type',
      organization: 'Organization',
    };
    
    return `${typeLabels[condition.type]}: ${condition.value.split(',').join(', ')}`;
  };

  const getTargetLabel = (target: SLATarget): string => {
    const typeLabels: Record<SLATargetType, string> = {
      first_response: 'First Response',
      next_response: 'Next Response',
      resolution: 'Resolution',
      agent_work: 'Agent Work',
    };
    
    let timeString = '';
    if (target.hours > 0) {
      timeString += `${target.hours}h `;
    }
    if (target.minutes > 0 || target.hours === 0) {
      timeString += `${target.minutes}m`;
    }
    
    return `${typeLabels[target.type]}: ${timeString}`;
  };

  const filteredPolicies = slaPolicies.filter(policy => {
    // Filter by search term
    const matchesSearch = 
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'enabled' && policy.enabled) || 
      (statusFilter === 'disabled' && !policy.enabled);
    
    return matchesSearch && matchesStatus;
  });

  const handleDeletePolicy = (id: string) => {
    if (confirm('Are you sure you want to delete this SLA policy?')) {
      setSLAPolicies(slaPolicies.filter(policy => policy.id !== id));
    }
  };

  const handleTogglePolicy = (id: string) => {
    setSLAPolicies(slaPolicies.map(policy => 
      policy.id === id ? { ...policy, enabled: !policy.enabled } : policy
    ));
  };

  return (
    <>
      <Head>
        <title>SLA Management | Sociamatic CRM</title>
        <meta name="description" content="Manage service level agreements and policies" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">SLA Management</h1>
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
                  placeholder="Search SLA policies by name or description"
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
                
                <Link
                  href="/sla/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create SLA Policy
                </Link>
              </div>
            </div>

            {/* SLA Policies Table */}
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Policy Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conditions
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Targets
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Business Hours
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPolicies.map((policy) => (
                          <tr key={policy.id}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                              <div className="text-sm text-gray-500">{policy.description}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Last updated: {policy.lastUpdated}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {policy.conditions.length > 0 ? (
                                <ul className="text-sm text-gray-500 space-y-1">
                                  {policy.conditions.map((condition, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        {getConditionLabel(condition)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-sm text-gray-500 italic">No conditions (applies to all tickets)</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <ul className="text-sm text-gray-500 space-y-1">
                                {policy.targets.map((target, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3" />
                                      {getTargetLabel(target)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {policy.businessHours}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Switch
                                checked={policy.enabled}
                                onChange={() => handleTogglePolicy(policy.id)}
                                className={`${policy.enabled ? 'bg-primary-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Enable SLA policy</span>
                                <span
                                  className={`${policy.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                              <span className="ml-2 text-sm text-gray-500">
                                {policy.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <Link
                                  href={`/sla/edit?id=${policy.id}`}
                                  className="text-primary-600 hover:text-primary-900"
                                  title="Edit SLA policy"
                                >
                                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                </Link>
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete SLA policy"
                                  onClick={() => handleDeletePolicy(policy.id)}
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

            {filteredPolicies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No SLA policies found matching your search criteria.</p>
              </div>
            )}

            {/* Business Hours Section */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Business Hours</h2>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                  Add Calendar
                </button>
              </div>
              
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {businessHours.map((hours) => (
                    <li key={hours.name}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">{hours.name}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <Link
                              href={`/sla/business-hours?id=${hours.name.replace(/\s+/g, '-').toLowerCase()}`}
                              className="ml-2 text-primary-600 hover:text-primary-900"
                              title="Edit business hours"
                            >
                              <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              {hours.startTime} - {hours.endTime} ({hours.timezone})
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              {hours.days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}