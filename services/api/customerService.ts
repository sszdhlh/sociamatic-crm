import apiClient from './apiClient';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  organizationId: string;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
  organizationId?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  organizationId?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface CustomerListParams {
  search?: string;
  organizationId?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export interface CustomerListResponse {
  customers: Customer[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

/**
 * 客户服务，提供客户的增删改查功能
 */
const customerService = {
  /**
   * 创建客户
   * @param data 客户创建请求数据
   */
  createCustomer: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.post<Customer>('/customers', data);
    return response.data;
  },
  
  /**
   * 获取客户列表
   * @param params 过滤和分页参数
   */
  getCustomers: async (params?: CustomerListParams): Promise<CustomerListResponse> => {
    const response = await apiClient.get<CustomerListResponse>('/customers', { params });
    return response.data;
  },
  
  /**
   * 获取客户详情
   * @param id 客户ID
   */
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },
  
  /**
   * 更新客户
   * @param id 客户ID
   * @param data 更新数据
   */
  updateCustomer: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },
  
  /**
   * 删除客户
   * @param id 客户ID
   */
  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  }
};

export default customerService; 