import apiClient from './apiClient';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  customerId: string;
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
  attachments?: string[];
  customFields?: Record<string, any>;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  customerId: string;
  assigneeId?: string;
  attachments?: string[];
  templateId?: string;
  customFields?: Record<string, any>;
}

export interface UpdateTicketRequest {
  status?: string;
  priority?: string;
  assigneeId?: string;
  customFields?: Record<string, any>;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  content: string;
  authorId: string;
  createdAt: string;
  isPrivate: boolean;
  attachments?: string[];
}

export interface CreateTicketCommentRequest {
  content: string;
  isPrivate: boolean;
  attachments?: string[];
}

export interface TicketListParams {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
  assigneeId?: string;
  customerId?: string;
  dateRange?: string;
}

export interface TicketListResponse {
  tickets: Ticket[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

/**
 * 工单服务，提供工单的增删改查功能
 */
const ticketService = {
  /**
   * 创建工单
   * @param data 工单创建请求数据
   */
  createTicket: async (data: CreateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>('/tickets', data);
    return response.data;
  },
  
  /**
   * 获取工单列表
   * @param params 过滤和分页参数
   */
  getTickets: async (params?: TicketListParams): Promise<TicketListResponse> => {
    const response = await apiClient.get<TicketListResponse>('/tickets', { params });
    return response.data;
  },
  
  /**
   * 获取工单详情
   * @param id 工单ID
   */
  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },
  
  /**
   * 更新工单
   * @param id 工单ID
   * @param data 更新数据
   */
  updateTicket: async (id: string, data: UpdateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.put<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },
  
  /**
   * 删除工单
   * @param id 工单ID
   */
  deleteTicket: async (id: string): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  },
  
  /**
   * 添加工单评论
   * @param ticketId 工单ID
   * @param data 评论数据
   */
  addComment: async (ticketId: string, data: CreateTicketCommentRequest): Promise<TicketComment> => {
    const response = await apiClient.post<TicketComment>(`/tickets/${ticketId}/comments`, data);
    return response.data;
  },
  
  /**
   * 获取工单评论
   * @param ticketId 工单ID
   */
  getComments: async (ticketId: string): Promise<TicketComment[]> => {
    const response = await apiClient.get<TicketComment[]>(`/tickets/${ticketId}/comments`);
    return response.data;
  }
};

export default ticketService; 