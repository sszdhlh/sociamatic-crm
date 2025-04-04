import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, ShareIcon, TagIcon, EyeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

type ViewVisibility = 'private' | 'team' | 'public';

type View = {
  id: string;
  name: string;
  description: string;
  filters: {
    status?: string[];
    priority?: string[];
    assignee?: string[];
    tags?: string[];
    dateRange?: string;
  };
  visibility: ViewVisibility;
  tags: string[];
  createdBy: string;
  createdAt: string;
  lastUsed: string;
};

export default function ViewsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<ViewVisibility | 'all'>('all');
  
  const [views, setViews] = useState<View[]>([
    {
      id: '1',
      name: 'Urgent Tickets',
      description: 'All open tickets with urgent priority',
      filters: {
        status: ['open', 'in-progress'],
        priority: ['urgent'],
      },
      visibility: 'team',
      tags: ['urgent', 'support'],
      createdBy: 'Support Manager',
      createdAt: '2023-09-10',
      lastUsed: '2023-10-21',
    },
    {
      id: '2',
      name: 'My Assigned Tickets',
      description: 'Tickets assigned to the current user',
      filters: {
        assignee: ['{{current_user}}'],
        status: ['open', 'in-progress', 'pending'],
      },
      visibility: 'private',
      tags: ['personal'],
      createdBy: 'Current User',
      createdAt: '2023-08-15',
      lastUsed: '2023-10-22',
    },
    {
      id: '3',
      name: 'Unassigned Tickets',
      description: 'All tickets without an assignee',
      filters: {
        assignee: ['none'],
        status: ['open'],
      },
      visibility: 'public',
      tags: ['triage', 'unassigned'],
      createdBy: 'System Admin',
      createdAt: '2023-07-20',
      lastUsed: '2023-10-20',
    },
    {
      id: '4',
      name: 'Recently Closed',
      description: 'Tickets closed in the last 7 days',
      filters: {
        status: ['closed'],
        dateRange: 'last_7_days',
      },
      visibility: 'team',
      tags: ['reporting', 'closed'],
      createdBy: 'Team Lead',
      createdAt: '2023-09-05',
      lastUsed: '2023-10-18',
    },
    {
      id: '5',
      name: 'VIP Customer Tickets',
      description: 'All tickets from VIP customers',
      filters: {
        tags: ['vip'],
      },
      visibility: 'team',
      tags: ['vip', 'priority'],
      createdBy: 'Customer Success Manager',
      createdAt: '2023-10-01',
      lastUsed: '2023-10-22',
    },
  ]);

  const getVisibilityLabel = (visibility: ViewVisibility): string => {
    const labels: Record<ViewVisibility, string> = {
      private: 'Private',
      team: 'Team',
      public: 'Public',
    };
    return labels[visibility];
  };

  const getVisibilityIcon = (visibility: ViewVisibility) => {
    switch (visibility) {
      case 'private':
        return <EyeIcon className="h-4 w-4" />;
      case 'team':
        return <UserGroupIcon className="h-4 w-4" />;
      case 'public':
        return <ShareIcon className="h-4 w-4" />;
    }
  };

  const getVisibilityColor = (visibility: ViewVisibility): string => {
    const colors: Record<ViewVisibility, string> = {
      private: 'bg-gray-100 text-gray-800',
      team: 'bg-blue-100 text-blue-800',
      public: 'bg-green-100 text-green-800',
    };
    return colors[visibility];
  };

  const formatFilters = (filters: View['filters']): string => {
    const parts: string[] = [];
    
    if (filters.status && filters.status.length > 0) {
      parts.push(`Status: ${filters.status.join(', ')}`);
    }
    
    if (filters.priority && filters.priority.length > 0) {
      parts.push(`Priority: ${filters.priority.join(', ')}`);
    }
    
    if (filters.assignee && filters.assignee.length > 0) {
      parts.push(`Assignee: ${filters.assignee.join(', ')}`);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      parts.push(`Tags: ${filters.tags.join(', ')}`);
    }
    
    if (filters.dateRange) {
      parts.push(`Date: ${filters.dateRange.replace(/_/g, ' ')}`);
    }
    
    return parts.join(' | ');
  };

  const filteredViews = views.filter(view => {
    // Filter by search term
    const matchesSearch = 
      view.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      view.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      view.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by visibility
    const matchesVisibility = visibilityFilter === 'all' || view.visibility === visibilityFilter;
    
    return matchesSearch && matchesVisibility;
  });

  const handleDeleteView = (id: string) => {
    if (confirm('Are you sure you want to delete this view?')) {
      setViews(views.filter(view => view.id !== id));
    }
  };

  return (
    <div className="py-6">
      <Head>
        <title>Custom Views | Sociamatic CRM</title>
        <meta name="description" content="Manage custom ticket views and filters" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Custom Views</h1>
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
                placeholder="Search views by name, description or tags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-3">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value as ViewVisibility | 'all')}
              >
                <option value="all">All Visibility</option>
                <option value="private">Private</option>
                <option value="team">Team</option>
                <option value="public">Public</option>
              </select>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create View
              </button>
            </div>
          </div>

          {/* Views Table */}
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          View Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Filters
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visibility
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tags
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Used
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredViews.map((view) => (
                        <tr key={view.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{view.name}</div>
                            <div className="text-sm text-gray-500">{view.description}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{formatFilters(view.filters)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVisibilityColor(view.visibility)}`}>
                              {getVisibilityIcon(view.visibility)}
                              <span className="ml-1.5">{getVisibilityLabel(view.visibility)}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {view.tags.map((tag) => (
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
                            {view.lastUsed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                className="text-primary-600 hover:text-primary-900"
                                title="Edit view"
                              >
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-900"
                                title="Share view"
                              >
                                <ShareIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900"
                                title="Delete view"
                                onClick={() => handleDeleteView(view.id)}
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

            {filteredViews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No views found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
}