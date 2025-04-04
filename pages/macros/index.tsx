import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, CheckCircleIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline';

type MacroCategory = 'greeting' | 'closing' | 'troubleshooting' | 'billing' | 'general';

type Macro = {
  id: string;
  name: string;
  content: string;
  category: MacroCategory;
  approved: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
};

export default function MacrosManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MacroCategory | 'all'>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all');
  
  const [macros, setMacros] = useState<Macro[]>([
    {
      id: '1',
      name: 'Standard Greeting',
      content: 'Hello, thank you for contacting Sociamatic Support. My name is {{agent.name}} and I\'ll be assisting you today.',
      category: 'greeting',
      approved: true,
      createdBy: 'Admin User',
      createdAt: '2023-09-15',
      usageCount: 245,
    },
    {
      id: '2',
      name: 'Technical Issue Response',
      content: 'I understand you\'re experiencing an issue with {{ticket.product}}. Let me help you troubleshoot this problem.',
      category: 'troubleshooting',
      approved: true,
      createdBy: 'Support Manager',
      createdAt: '2023-09-20',
      usageCount: 187,
    },
    {
      id: '3',
      name: 'Billing Question',
      content: 'Regarding your billing inquiry, I can confirm that your account {{customer.account_status}}. Your next payment of {{customer.next_payment_amount}} is scheduled for {{customer.next_payment_date}}.',
      category: 'billing',
      approved: true,
      createdBy: 'Billing Team',
      createdAt: '2023-10-05',
      usageCount: 92,
    },
    {
      id: '4',
      name: 'Closing - Satisfaction Survey',
      content: 'Is there anything else I can help you with today? After our conversation, you\'ll receive a brief satisfaction survey. Your feedback helps us improve our service.',
      category: 'closing',
      approved: false,
      createdBy: 'Quality Assurance',
      createdAt: '2023-10-18',
      usageCount: 0,
    },
    {
      id: '5',
      name: 'General Apology',
      content: 'I apologize for the inconvenience this has caused. We understand how important this is and we\'re working to resolve it as quickly as possible.',
      category: 'general',
      approved: true,
      createdBy: 'Training Team',
      createdAt: '2023-09-25',
      usageCount: 156,
    },
  ]);

  const getCategoryLabel = (category: MacroCategory): string => {
    const labels: Record<MacroCategory, string> = {
      greeting: 'Greeting',
      closing: 'Closing',
      troubleshooting: 'Troubleshooting',
      billing: 'Billing',
      general: 'General',
    };
    return labels[category];
  };

  const getCategoryColor = (category: MacroCategory): string => {
    const colors: Record<MacroCategory, string> = {
      greeting: 'bg-green-100 text-green-800',
      closing: 'bg-purple-100 text-purple-800',
      troubleshooting: 'bg-blue-100 text-blue-800',
      billing: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };

  const filteredMacros = macros.filter(macro => {
    // Filter by search term
    const matchesSearch = 
      macro.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      macro.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === 'all' || macro.category === categoryFilter;
    
    // Filter by approval status
    const matchesApproval = 
      approvalFilter === 'all' || 
      (approvalFilter === 'approved' && macro.approved) || 
      (approvalFilter === 'pending' && !macro.approved);
    
    return matchesSearch && matchesCategory && matchesApproval;
  });

  const handleDeleteMacro = (id: string) => {
    if (confirm('Are you sure you want to delete this macro?')) {
      setMacros(macros.filter(macro => macro.id !== id));
    }
  };

  const handleApproveMacro = (id: string) => {
    setMacros(macros.map(macro => 
      macro.id === id ? { ...macro, approved: true } : macro
    ));
  };

  return (
    <>
      <Head>
        <title>Ticket Macros | Sociamatic CRM</title>
        <meta name="description" content="Manage ticket macros and canned responses" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Ticket Macros</h1>
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
                  placeholder="Search macros by name or content"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as MacroCategory | 'all')}
                >
                  <option value="all">All Categories</option>
                  <option value="greeting">Greeting</option>
                  <option value="closing">Closing</option>
                  <option value="troubleshooting">Troubleshooting</option>
                  <option value="billing">Billing</option>
                  <option value="general">General</option>
                </select>
                
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value as 'all' | 'approved' | 'pending')}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Approval</option>
                </select>
                
                <Link
                  href="/macros/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create Macro
                </Link>
              </div>
            </div>

            {/* Macros Table */}
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Macro Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created By
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Usage
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMacros.map((macro) => (
                          <tr key={macro.id}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{macro.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-md">{macro.content}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(macro.category)}`}>
                                <TagIcon className="-ml-0.5 mr-1.5 h-3 w-3" />
                                {getCategoryLabel(macro.category)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {macro.approved ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <XMarkIcon className="-ml-0.5 mr-1.5 h-3 w-3" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>{macro.createdBy}</div>
                              <div className="text-xs text-gray-400">{macro.createdAt}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {macro.usageCount} times
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                {!macro.approved && (
                                  <button
                                    type="button"
                                    className="text-green-600 hover:text-green-900"
                                    title="Approve macro"
                                    onClick={() => handleApproveMacro(macro.id)}
                                  >
                                    <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="text-primary-600 hover:text-primary-900"
                                  title="Edit macro"
                                >
                                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete macro"
                                  onClick={() => handleDeleteMacro(macro.id)}
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

            {filteredMacros.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No macros found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}