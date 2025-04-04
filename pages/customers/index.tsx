import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { MagnifyingGlassIcon, PencilIcon, TagIcon, ClockIcon, UserPlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type Customer = {
  id: string;
  name: string;
  email: string;
  timezone: string;
  tags: string[];
  ticketCount: number;
  lastActive: string;
};

export default function CustomerDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      timezone: 'UTC-5 (Eastern Time)',
      tags: ['VIP', 'Enterprise'],
      ticketCount: 12,
      lastActive: '2023-10-15',
    },
    {
      id: '2',
      name: 'Cody Fisher',
      email: 'cody.fisher@example.com',
      timezone: 'UTC+1 (Central European Time)',
      tags: ['Support', 'Trial'],
      ticketCount: 3,
      lastActive: '2023-10-20',
    },
    {
      id: '3',
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      timezone: 'UTC+0 (Greenwich Mean Time)',
      tags: ['Enterprise'],
      ticketCount: 8,
      lastActive: '2023-10-18',
    },
    {
      id: '4',
      name: 'Jenny Wilson',
      email: 'jenny.wilson@example.com',
      timezone: 'UTC-8 (Pacific Time)',
      tags: ['SMB'],
      ticketCount: 5,
      lastActive: '2023-10-12',
    },
    {
      id: '5',
      name: 'Kristin Watson',
      email: 'kristin.watson@example.com',
      timezone: 'UTC+9 (Japan Standard Time)',
      tags: ['Enterprise', 'Technical'],
      ticketCount: 15,
      lastActive: '2023-10-21',
    },
  ]);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMergeCustomers = () => {
    // This would open a modal for selecting customers to merge
    alert('Merge functionality would be implemented here');
  };

  return (
    <div className="py-6">
      <Head>
        <title>Customer Directory | Sociamatic CRM</title>
        <meta name="description" content="Manage and view customer profiles" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Customer Directory</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Search and Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="w-full md:w-96 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search customers by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleMergeCustomers}
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                Merge Duplicates
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Customer
              </button>
            </div>
          </div>

          {/* Customer Table */}
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timezone
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tags
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tickets
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-primary-800 font-medium">
                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">{customer.timezone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-2">
                              {customer.tags.map((tag) => (
                                <span 
                                  key={tag} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                >
                                  <TagIcon className="-ml-0.5 mr-1.5 h-3 w-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.ticketCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No customers found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}