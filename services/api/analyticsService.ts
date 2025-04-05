import apiClient from './apiClient';

export interface TicketStatisticsParams {
  startDate?: string;
  endDate?: string;
  groupBy?: string;
  metrics?: string;
}

export interface TicketStatistics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  ticketsByPriority: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  ticketTrend: Array<{
    date: string;
    count: number;
  }>;
}

export interface ResponseTimeAnalysis {
  averageFirstResponseTime: number;
  averageResolutionTime: number;
  responseTimeByPriority: Record<string, number>;
  responseTimeByAgent: Array<{
    agentId: string;
    agentName: string;
    averageResponseTime: number;
  }>;
  responseTimeTrend: Array<{
    date: string;
    responseTime: number;
  }>;
}

export interface SLAPerformance {
  overallCompliance: number;
  complianceByPriority: Record<string, number>;
  complianceByAgent: Array<{
    agentId: string;
    agentName: string;
    compliance: number;
  }>;
  complianceTrend: Array<{
    date: string;
    compliance: number;
  }>;
}

export interface AgentPerformance {
  agents: Array<{
    agentId: string;
    agentName: string;
    ticketsResolved: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    slaCompliance: number;
    customerSatisfaction: number;
  }>;
}

/**
 * 分析服务，提供获取各种统计数据的功能
 */
const analyticsService = {
  /**
   * 获取工单统计数据
   * @param params 统计参数
   */
  getTicketStatistics: async (params?: TicketStatisticsParams): Promise<TicketStatistics> => {
    const response = await apiClient.get<TicketStatistics>('/analytics/tickets', { params });
    return response.data;
  },
  
  /**
   * 获取响应时间分析
   * @param params 统计参数
   */
  getResponseTimeAnalysis: async (params?: TicketStatisticsParams): Promise<ResponseTimeAnalysis> => {
    const response = await apiClient.get<ResponseTimeAnalysis>('/analytics/response-time', { params });
    return response.data;
  },
  
  /**
   * 获取SLA性能数据
   * @param params 统计参数
   */
  getSLAPerformance: async (params?: TicketStatisticsParams): Promise<SLAPerformance> => {
    const response = await apiClient.get<SLAPerformance>('/analytics/sla-performance', { params });
    return response.data;
  },
  
  /**
   * 获取客服绩效数据
   * @param params 统计参数
   */
  getAgentPerformance: async (params?: TicketStatisticsParams): Promise<AgentPerformance> => {
    const response = await apiClient.get<AgentPerformance>('/analytics/agent-performance', { params });
    return response.data;
  }
};

export default analyticsService; 