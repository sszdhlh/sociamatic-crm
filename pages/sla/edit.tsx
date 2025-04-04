import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';

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

export default function EditSLAPolicy() {
  const router = useRouter();
  const { id } = router.query;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    businessHours: 'Standard Business Hours',
  });
  
  const [conditions, setConditions] = useState<SLACondition[]>([]);
  const [targets, setTargets] = useState<SLATarget[]>([]);
  const [enabled, setEnabled] = useState(true);
  
  const [newCondition, setNewCondition] = useState<SLACondition>({
    type: 'priority',
    value: '',
  });
  
  const [newTarget, setNewTarget] = useState<SLATarget>({
    type: 'first_response',
    hours: 0,
    minutes: 0,
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    targets?: string;
  }>({});

  const [loading, setLoading] = useState(true);

  const businessHoursOptions = [
    'Standard Business Hours',
    '24/7 Support',
    'Extended Hours',
  ];

  // Mock data for demonstration purposes
  const mockSLAPolicies: SLAPolicy[] = [
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
  ];

  // Load SLA policy data when component mounts
  useEffect(() => {
    if (id) {
      // In a real application, you would fetch the data from an API
      // For now, we'll use mock data
      const policyId = Array.isArray(id) ? id[0] : id;
      const policy = mockSLAPolicies.find(p => p.id === policyId);
      
      if (policy) {
        setFormData({
          name: policy.name,
          description: policy.description,
          businessHours: policy.businessHours,
        });
        setConditions(policy.conditions);
        setTargets(policy.targets);
        setEnabled(policy.enabled);
        setLoading(false);
      } else {
        // Policy not found, redirect to list
        router.push('/sla');
      }
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCondition(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTarget(prev => ({
      ...prev,
      [name]: name === 'type' ? value : parseInt(value) || 0
    }));
  };

  const addCondition = () => {
    if (newCondition.value.trim() === '') return;
    
    setConditions([...conditions, { ...newCondition }]);
    setNewCondition({
      type: 'priority',
      value: '',
    });
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const addTarget = () => {
    if (newTarget.hours === 0 && newTarget.minutes === 0) {
      alert('Please specify a time for the target');
      return;
    }
    
    setTargets([...targets, { ...newTarget }]);
    setNewTarget({
      type: 'first_response',
      hours: 0,
      minutes: 0,
    });
    
    // Clear target error if it exists
    if (errors.targets) {
      setErrors(prev => ({ ...prev, targets: undefined }));
    }
  };

  const removeTarget = (index: number) => {
    setTargets(targets.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Policy name is required';
    }
    
    if (targets.length === 0) {
      newErrors.targets = 'At least one target is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Here you would typically send the data to your API
    console.log('Updating SLA policy:', {
      id,
      ...formData,
      conditions,
      targets,
      enabled,
    });
    
    // Redirect back to SLA list
    router.push('/sla');
  };

  const getConditionTypeLabel = (type: SLAConditionType): string => {
    const labels: Record<SLAConditionType, string> = {
      priority: 'Priority',
      channel: 'Channel',
      tags: 'Tags',
      customer_type: 'Customer Type',
      organization: 'Organization',
    };
    return labels[type];
  };

  const getTargetTypeLabel = (type: SLATargetType): string => {
    const labels: Record<SLATargetType, string> = {
      first_response: 'First Response',
      next_response: 'Next Response',
      resolution: 'Resolution',
      agent_work: 'Agent Work',
    };
    return labels[type];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <p>Loading SLA policy...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit SLA Policy | Sociamatic CRM</title>
        <meta name="description" content="Edit service level agreement policy" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 text-gray-400 hover:text-gray-500"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Edit SLA Policy</h1>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 max-w-3xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
                  <p className="mt-1 text-sm text-gray-500">Edit the basic details of your SLA policy.</p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Policy Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                        placeholder="e.g., Enterprise Support"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe the purpose of this SLA policy"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700">
                      Business Hours
                    </label>
                    <div className="mt-1">
                      <select
                        id="businessHours"
                        name="businessHours"
                        value={formData.businessHours}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        {businessHoursOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <div className="flex items-center">
                      <input
                        id="enabled"
                        name="enabled"
                        type="checkbox"
                        checked={enabled}
                        onChange={() => setEnabled(!enabled)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                        Policy Enabled
                      </label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      When disabled, this policy will not be applied to any tickets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Conditions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Define when this SLA policy should apply. If no conditions are specified, the policy will apply to all tickets.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end space-x-4">
                    <div className="w-1/3">
                      <label htmlFor="conditionType" className="block text-sm font-medium text-gray-700">
                        Condition Type
                      </label>
                      <select
                        id="conditionType"
                        name="type"
                        value={newCondition.type}
                        onChange={handleConditionChange}
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="priority">Priority</option>
                        <option value="channel">Channel</option>
                        <option value="tags">Tags</option>
                        <option value="customer_type">Customer Type</option>
                        <option value="organization">Organization</option>
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="conditionValue" className="block text-sm font-medium text-gray-700">
                        Value
                      </label>
                      <input
                        type="text"
                        id="conditionValue"
                        name="value"
                        value={newCondition.value}
                        onChange={handleConditionChange}
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., high,urgent or comma-separated values"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCondition}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Add
                    </button>
                  </div>

                  {conditions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Applied Conditions:</h4>
                      <ul className="space-y-2">
                        {conditions.map((condition, index) => (
                          <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                            <span className="text-sm">
                              <span className="font-medium">{getConditionTypeLabel(condition.type)}:</span> {condition.value}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCondition(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 space-y-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Targets</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Define the time targets for this SLA policy.
                  </p>
                  {errors.targets && (
                    <p className="mt-1 text-sm text-red-600">{errors.targets}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-end space-x-4">
                    <div className="w-1/3">
                      <label htmlFor="targetType" className="block text-sm font-medium text-gray-700">
                        Target Type
                      </label>
                      <select
                        id="targetType"
                        name="type"
                        value={newTarget.type}
                        onChange={handleTargetChange}
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="first_response">First Response</option>
                        <option value="next_response">Next Response</option>
                        <option value="resolution">Resolution</option>
                        <option value="agent_work">Agent Work</option>
                      </select>
                    </div>
                    <div className="w-1/6">
                      <label htmlFor="targetHours" className="block text-sm font-medium text-gray-700">
                        Hours
                      </label>
                      <input
                        type="number"
                        id="targetHours"
                        name="hours"
                        min="0"
                        value={newTarget.hours}
                        onChange={handleTargetChange}
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="w-1/6">
                      <label htmlFor="targetMinutes" className="block text-sm font-medium text-gray-700">
                        Minutes
                      </label>
                      <input
                        type="number"
                        id="targetMinutes"
                        name="minutes"
                        min="0"
                        max="59"
                        value={newTarget.minutes}
                        onChange={handleTargetChange}
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addTarget}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Add
                    </button>
                  </div>

                  {targets.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Applied Targets:</h4>
                      <ul className="space-y-2">
                        {targets.map((target, index) => (
                          <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                            <span className="text-sm flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1 text-primary-500" />
                              <span className="font-medium">{getTargetTypeLabel(target.type)}:</span>
                              {' '}
                              {target.hours > 0 && `${target.hours}h `}
                              {target.minutes > 0 && `${target.minutes}m`}
                              {target.hours === 0 && target.minutes === 0 && '0m'}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTarget(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Update Policy
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}