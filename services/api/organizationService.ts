import apiClient from './apiClient';

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: string;
  address: string;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
  industry: string;
  size?: string;
  address?: string;
  customFields?: Record<string, any>;
}

export interface UpdateOrganizationRequest {
  name?: string;
  industry?: string;
  size?: string;
  address?: string;
  customFields?: Record<string, any>;
}

export interface OrganizationListParams {
  search?: string;
  industry?: string;
  page?: number;
  limit?: number;
}

export interface OrganizationListResponse {
  organizations: Organization[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

/**
 * 组织服务，提供组织的增删改查功能
 */
const organizationService = {
  /**
   * 创建组织
   * @param data 组织创建请求数据
   */
  createOrganization: async (data: CreateOrganizationRequest): Promise<Organization> => {
    const response = await apiClient.post<Organization>('/organizations', data);
    return response.data;
  },
  
  /**
   * 获取组织列表
   * @param params 过滤和分页参数
   */
  getOrganizations: async (params?: OrganizationListParams): Promise<OrganizationListResponse> => {
    const response = await apiClient.get<OrganizationListResponse>('/organizations', { params });
    return response.data;
  },
  
  /**
   * 获取组织详情
   * @param id 组织ID
   */
  getOrganizationById: async (id: string): Promise<Organization> => {
    const response = await apiClient.get<Organization>(`/organizations/${id}`);
    return response.data;
  },
  
  /**
   * 更新组织
   * @param id 组织ID
   * @param data 更新数据
   */
  updateOrganization: async (id: string, data: UpdateOrganizationRequest): Promise<Organization> => {
    const response = await apiClient.put<Organization>(`/organizations/${id}`, data);
    return response.data;
  },
  
  /**
   * 删除组织
   * @param id 组织ID
   */
  deleteOrganization: async (id: string): Promise<void> => {
    await apiClient.delete(`/organizations/${id}`);
  }
};

export default organizationService; 