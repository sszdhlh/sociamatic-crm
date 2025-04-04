import { useState } from 'react';
import Head from 'next/head';
import { MagnifyingGlassIcon, PencilIcon, UserGroupIcon, TrashIcon, PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';

type Organization = {
  id: string;
  name: string;
  domain: string;
  memberCount: number;
  ticketCount: number;
  avgResolutionTime: string;
  createdAt: string;
};

export default function OrganizationDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      domain: 'acme.com',
      memberCount: 24,
      ticketCount: 156,
      avgResolutionTime: '4h 32m',
      createdAt: '2023-01-15',
    },
    {
      id: '2',
      name: 'Globex Industries',
      domain: 'globex.co',
      memberCount: 12,
      ticketCount: 87,
      avgResolutionTime: '6h 15m',
      createdAt: '2023-03-22',
    },
    {
      id: '3',
      name: 'Initech LLC',
      domain: 'initech.org',
      memberCount: 8,
      ticketCount: 42,
      avgResolutionTime: '3h 45m',
      createdAt: '2023-05-10',
    },
    {
      id: '4',
      name: 'Umbrella Corp',
      domain: 'umbrella.net',
      memberCount: 35,
      ticketCount: 210,
      avgResolutionTime: '5h 20m',
      createdAt: '2023-02-28',
    },
    {
      id: '5',
      name: 'Stark Industries',
      domain: 'stark.tech',
      memberCount: 18,
      ticketCount: 124,
      avgResolutionTime: '2h 50m',
      createdAt: '2023-04-05',
    },
  ]);

  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    org.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteOrganization = (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(organizations.filter(org => org.id !== id));
    }
  };

  return (
    <div className="py-6">
      <Head>
        <title>Organization Directory | Sociamatic CRM</title>
        <meta name="description" content="Manage and view organization profiles" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Organization Directory</h1>
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
                placeholder="Search organizations by name or domain"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Organization
              </button>
            </div>
          </div>

          {/* Organizations Table */}
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Members
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tickets
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Resolution
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrganizations.map((org) => (
                        <tr key={org.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-primary-800 font-medium">
                                    {org.name.substring(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                <div className="text-sm text-gray-500">{org.domain}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">{org.memberCount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {org.ticketCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">{org.avgResolutionTime}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {org.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                className="text-primary-600 hover:text-primary-900"
                                title="Edit organization"
                              >
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900"
                                title="Delete organization"
                                onClick={() => handleDeleteOrganization(org.id)}
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
        </div>
      </div>
    </div>
  );
}