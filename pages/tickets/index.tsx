import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import TicketList from '@/components/tickets/TicketList';

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In actual project, API call should be made here for search
    console.log('Search:', searchQuery);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedPriority([]);
  };

  return (
    <div className="py-6">
      <Head>
        <title>Ticket Management | Sociamatic Smart Self-Service Portal</title>
        <meta name="description" content="Manage and view Sociamatic tickets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Ticket Management</h1>
          <button
            onClick={handleRefresh}
            className="btn-outline flex items-center"
            disabled={isLoading}
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <form onSubmit={handleSearch} className="w-full sm:w-96">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search ticket ID, subject or requester"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center">
            <button
              type="button"
              className="btn-outline flex items-center"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filter
              {(selectedStatus.length > 0 || selectedPriority.length > 0) && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {selectedStatus.length + selectedPriority.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="mt-4 p-4 bg-white shadow rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                <div className="space-y-2">
                  {['open', 'pending', 'solved', 'closed'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={selectedStatus.includes(status)}
                        onChange={() => handleStatusChange(status)}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {status === 'open' ? 'Open' :
                         status === 'pending' ? 'Pending' :
                         status === 'solved' ? 'Solved' : 'Closed'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                <div className="space-y-2">
                  {['urgent', 'high', 'normal', 'low'].map((priority) => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={selectedPriority.includes(priority)}
                        onChange={() => handlePriorityChange(priority)}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {priority === 'urgent' ? 'Urgent' :
                         priority === 'high' ? 'High' :
                         priority === 'normal' ? 'Normal' : 'Low'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="text-sm text-gray-700 hover:text-gray-900 mr-4"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Ticket List */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
          <TicketList limit={20} />
        </div>
        {/* Create Ticket Button */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/tickets/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}