import {
  TicketIcon,
  ClockIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

type DashboardStatsProps = {
  data: {
    openTickets: number;
    pendingTickets: number;
    solvedTickets: number;
    responseTime: string;
    resolutionTime: string;
    automationRuns: number;
    configIssues: number;
  };
};

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      name: 'Open Tickets',
      value: data.openTickets,
      icon: TicketIcon,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      name: 'Pending Tickets',
      value: data.pendingTickets,
      icon: TicketIcon,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Solved Tickets',
      value: data.solvedTickets,
      icon: TicketIcon,
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Average Response Time',
      value: data.responseTime,
      icon: ClockIcon,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      name: 'Average Resolution Time',
      value: data.resolutionTime,
      icon: ClockIcon,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      name: 'Automation Runs',
      value: data.automationRuns,
      icon: CogIcon,
      color: 'bg-cyan-100 text-cyan-600',
    },
    {
      name: 'Configuration Issues',
      value: data.configIssues,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="mt-6 w-full">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}