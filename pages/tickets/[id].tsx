import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  ChatBubbleLeftIcon,
  ClockIcon,
  UserCircleIcon,
  TagIcon,
  ArrowPathIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

type Comment = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  is_private: boolean;
};

type TicketHistory = {
  id: string;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
};

type Ticket = {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'solved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  requester: string;
  assignee: string;
  created_at: string;
  updated_at: string;
  description: string;
  tags: string[];
};

export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<TicketHistory[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');

  useEffect(() => {
    if (id) {
      // Mock data - replace with actual API calls
      const mockTicket: Ticket = {
        id: 'SM-1001',
        subject: 'Unable to login to admin console',
        status: 'open',
        priority: 'high',
        requester: 'John Smith',
        assignee: 'Support Team',
        created_at: '2023-10-15T08:30:00Z',
        updated_at: '2023-10-15T09:45:00Z',
        description: 'I am unable to access the admin console. Getting "Access Denied" error.',
        tags: ['login', 'admin', 'access']
      };

      const mockComments: Comment[] = [
        {
          id: 'c1',
          author: 'Support Team',
          content: 'Could you please provide your admin username?',
          created_at: '2023-10-15T09:00:00Z',
          is_private: false
        },
        {
          id: 'c2',
          author: 'John Smith',
          content: 'My username is john.smith@example.com',
          created_at: '2023-10-15T09:15:00Z',
          is_private: false
        }
      ];

      const mockHistory: TicketHistory[] = [
        {
          id: 'h1',
          action: 'created',
          actor: 'John Smith',
          details: 'Ticket created',
          timestamp: '2023-10-15T08:30:00Z'
        },
        {
          id: 'h2',
          action: 'status_changed',
          actor: 'System',
          details: 'Status changed from New to Open',
          timestamp: '2023-10-15T08:31:00Z'
        },
        {
          id: 'h3',
          action: 'assigned',
          actor: 'System',
          details: 'Assigned to Support Team',
          timestamp: '2023-10-15T08:32:00Z'
        }
      ];

      setTicket(mockTicket);
      setComments(mockComments);
      setHistory(mockHistory);
      setLoading(false);
    }
  }, [id]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${comments.length + 1}`,
      author: 'Support Team',
      content: newComment,
      created_at: new Date().toISOString(),
      is_private: isPrivate
    };

    setComments([...comments, comment]);
    setNewComment('');
    setIsPrivate(false);
  };

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
      minute: '2-digit'
    });
  };

  if (loading || !ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <Head>
        <title>Ticket {ticket.id} | Sociamatic Smart Self-Service Portal</title>
        <meta name="description" content={`Details for ticket ${ticket.id}`} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Ticket {ticket.id}
          </h1>
          <button
            onClick={() => router.back()}
            className="btn-outline"
          >
            Back to List
          </button>
        </div>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">{ticket.subject}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </span>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Requester</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {ticket.requester}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Assignee</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {ticket.assignee}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {formatDate(ticket.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {formatDate(ticket.updated_at)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Tags</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{ticket.description}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`${
                      activeTab === 'comments'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                    Comments ({comments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`${
                      activeTab === 'history'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <ClockIcon className="h-5 w-5 mr-2" />
                    History ({history.length})
                  </button>
                </nav>
              </div>

              <div className="mt-6">
                {activeTab === 'comments' ? (
                  <div className="space-y-6">
                    {comments.map(comment => (
                      <div key={comment.id} className={`flex space-x-3 ${comment.is_private ? 'bg-gray-50 p-4 rounded-lg' : ''}`}>
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            {comment.is_private && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                Private
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-700">{comment.content}</div>
                          <div className="mt-2 text-xs text-gray-500">{formatDate(comment.created_at)}</div>
                        </div>
                      </div>
                    ))}

                    <form onSubmit={handleSubmitComment} className="mt-6">
                      <div>
                        <label htmlFor="comment" className="sr-only">Add comment</label>
                        <textarea
                          id="comment"
                          name="comment"
                          rows={3}
                          className="input"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="private"
                            name="private"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                          />
                          <label htmlFor="private" className="ml-2 text-sm text-gray-500">
                            Add as private note
                          </label>
                        </div>
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={!newComment.trim()}
                        >
                          Add Comment
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {history.map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className="relative pb-8">
                            {eventIdx !== history.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <ClockIcon className="h-5 w-5 text-gray-500" />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {event.details}{' '}
                                    <span className="font-medium text-gray-900">{event.actor}</span>
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  {formatDate(event.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}