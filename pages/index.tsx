import Head from 'next/head';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TicketList from '@/components/tickets/TicketList';
import TechnicalReviewCard from '@/components/technical/TechnicalReviewCard';
import AutomationCard from '@/components/automation/AutomationCard';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  // Use authentication context
  const { isAuthenticated, loading, user } = useAuth();
  
  // If the authentication status is loading, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, don't display content - AuthContext will handle redirection automatically
  if (!isAuthenticated) {
    return null;
  }
  
  // Simulated data - should be obtained from the API in actual projects
  const dashboardData = {
    openTickets: 24,
    pendingTickets: 12,
    solvedTickets: 156,
    responseTime: '1.8 hrs',
    resolutionTime: '8.5 hrs',
    automationRuns: 342,
    configIssues: 3
  };

  return (
      <div className="py-6">
        <Head>
          <title>Dashboard | Sociamatic Smart Self-Service Portal</title>
          <meta name="description" content="Sociamatic Smart Self-Service Portal Dashboard" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {user && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">Welcome, {user.name}!</p>
          </div>
        )}
        
        {/* Statistics Cards */}
        <DashboardStats data={dashboardData} />
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Work Order List */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Tickets</h2>
            <TicketList limit={5} />
          </div>
          
          {/* Technical Review Cards */}
          <div className="space-y-6">
            <TechnicalReviewCard issueCount={dashboardData.configIssues} />
            
            {/* Automated Operation Cards */}
            <AutomationCard />
          </div>
        </div>
        </div>
      </div>
  );
}