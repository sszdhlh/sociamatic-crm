import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';

type Ticket = {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'solved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  requester: string;
  created_at: string;
  updated_at: string;
};

type TicketListProps = {
  limit?: number;
};

export default function TicketList({ limit = 10 }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate getting data from API
    const fetchTickets = () => {
      // Here should be the actual API call
      // const response = await fetch('/api/tickets');
      // const data = await response.json();
      
      // Simulating data
      const mockTickets: Ticket[] = [
        {
          id: 'SM-1001',
          subject: 'Unable to login to admin console',
          status: 'open',
          priority: 'high',
          requester: 'John Smith',
          created_at: '2023-10-15T08:30:00Z',
          updated_at: '2023-10-15T09:45:00Z',
        },
        {
          id: 'SM-1002',
          subject: 'How to set up auto-reply rules?',
          status: 'pending',
          priority: 'normal',
          requester: 'Jane Doe',
          created_at: '2023-10-14T14:20:00Z',
          updated_at: '2023-10-15T10:15:00Z',
        },
        {
          id: 'SM-1003',
          subject: 'Integrate third-party payment system',
          status: 'open',
          priority: 'urgent',
          requester: 'Mike Johnson',
          created_at: '2023-10-15T07:10:00Z',
          updated_at: '2023-10-15T11:30:00Z',
        },
        {
          id: 'SM-1004',
          subject: 'Knowledge base article update request',
          status: 'solved',
          priority: 'low',
          requester: 'Sarah Williams',
          created_at: '2023-10-13T09:45:00Z',
          updated_at: '2023-10-14T16:20:00Z',
        },
        {
          id: 'SM-1005',
          subject: 'Bulk user import failed',
          status: 'open',
          priority: 'high',
          requester: 'Robert Chen',
          created_at: '2023-10-15T10:05:00Z',
          updated_at: '2023-10-15T10:30:00Z',
        },
      ];
      
      setTickets(mockTickets.slice(0, limit));
      setLoading(false);
    };

    fetchTickets();
  }, [limit]);

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'solved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (tickets.length === 0) {
    return <div className="text-center py-4">No tickets available</div>;
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <Link href={`/tickets/${ticket.id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <div className="flex text-sm">
                      <p className="font-medium text-primary-600 truncate">{ticket.subject}</p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">({ticket.id})</p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <UserCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="truncate">{ticket.requester}</span>
                      </div>
                      <div className="ml-4 flex items-center text-sm text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span>{formatDate(ticket.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' ? 'Open' : 
                       ticket.status === 'pending' ? 'Pending' : 
                       ticket.status === 'solved' ? 'Solved' : 'Closed'}
                    </span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'urgent' ? 'Urgent' : 
                       ticket.priority === 'high' ? 'High' : 
                       ticket.priority === 'normal' ? 'Normal' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}