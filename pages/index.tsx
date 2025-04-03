import { useState } from 'react';
import Head from 'next/head';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TicketList from '@/components/tickets/TicketList';
import TechnicalReviewCard from '@/components/technical/TechnicalReviewCard';
import AutomationCard from '@/components/automation/AutomationCard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // If the user is not authenticated, display the login page
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Sociamatic Smart Self-Service Portal</title>
          <meta name="description" content="Sociamatic Smart Self-Service Portal, improving operational efficiency and customer support" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to Your Account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connect your Sociamatic instance to start smart management
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={() => setIsAuthenticated(true)}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Login with Sociamatic Account
            </button>
            <div className="text-sm text-center">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Learn more about our services
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <Head>
        <title>Dashboard | Sociamatic Smart Self-Service Portal</title>
        <meta name="description" content="Sociamatic Smart Self-Service Portal Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
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