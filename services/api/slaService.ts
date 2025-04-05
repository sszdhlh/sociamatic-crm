import apiClient from './apiClient';

export interface SLAPolicy {
  id: string;
  name: string;
  description: string;
  responseTime: number;
  resolutionTime: number;
  priority: string;
  businessHours: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSLAPolicyRequest {
  name: string;
  description: string;
  responseTime: number;
  resolutionTime: number;
  priority: string;
  businessHours: boolean;
}

export interface UpdateSLAPolicyRequest {
  name?: string;
  description?: string;
  responseTime?: number;
  resolutionTime?: number;
  priority?: string;
  businessHours?: boolean;
}

export interface SLAPolicyListParams {
  priority?: string;
  page?: number;
  limit?: number;
}

export interface SLAPolicyListResponse {
  slaPolicies: SLAPolicy[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

/**
 * SLA服务，提供SLA策略的增删改查功能
 */
const slaService = {
  /**
   * 创建SLA策略
   * @param data SLA策略创建请求数据
   */
  createSLAPolicy: async (data: CreateSLAPolicyRequest): Promise<SLAPolicy> => {
    const response = await apiClient.post<SLAPolicy>('/sla-policies', data);
    return response.data;
  },
  
  /**
   * 获取SLA策略列表
   * @param params 过滤和分页参数
   */
  getSLAPolicies: async (params?: SLAPolicyListParams): Promise<SLAPolicyListResponse> => {
    const response = await apiClient.get<SLAPolicyListResponse>('/sla-policies', { params });
    return response.data;
  },
  
  /**
   * 获取SLA策略详情
   * @param id SLA策略ID
   */
  getSLAPolicyById: async (id: string): Promise<SLAPolicy> => {
    const response = await apiClient.get<SLAPolicy>(`/sla-policies/${id}`);
    return response.data;
  },
  
  /**
   * 更新SLA策略
   * @param id SLA策略ID
   * @param data 更新数据
   */
  updateSLAPolicy: async (id: string, data: UpdateSLAPolicyRequest): Promise<SLAPolicy> => {
    const response = await apiClient.put<SLAPolicy>(`/sla-policies/${id}`, data);
    return response.data;
  },
  
  /**
   * 删除SLA策略
   * @param id SLA策略ID
   */
  deleteSLAPolicy: async (id: string): Promise<void> => {
    await apiClient.delete(`/sla-policies/${id}`);
  }
};

export default slaService; 