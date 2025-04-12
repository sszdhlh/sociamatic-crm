import apiClient from './apiClient';

// API base configuration from apiClient
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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
 * Ticket service, provides CRUD operations for tickets
 */
const ticketService = {
  /**
   * Create a ticket
   * @param data Ticket creation request data
   */
  createTicket: async (data: CreateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>('/tickets', data);
    return response.data;
  },

  /**
   * Get tickets list with pagination and filters
   * @param params Filter and pagination parameters
   */
  getTickets: async (params: TicketListParams): Promise<TicketListResponse> => {
    const response = await apiClient.get<TicketListResponse>('/tickets', { params });
    return response.data;
  },

  /**
   * Add comment to a ticket
   * @param ticketId Ticket ID
   * @param data Comment data
   */
  addComment: async (ticketId: string, data: CreateTicketCommentRequest): Promise<TicketComment> => {
    const response = await apiClient.post<TicketComment>(`/tickets/${ticketId}/comments`, data);
    return response.data;
  },

  /**
   * Get ticket comments
   * @param ticketId Ticket ID
   */
  getComments: async (ticketId: string): Promise<TicketComment[]> => {
    const response = await apiClient.get<TicketComment[]>(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  /**
   * Create a ticket with file attachments
   * @param data Ticket creation request data
   * @param files Array of files to upload
   */
  createTicketWithFiles: async (data: Omit<CreateTicketRequest, 'attachments'>, files: File[]): Promise<Ticket> => {
    try {
      // First upload files to get attachment IDs
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'ticket-attachment');

        const response = await apiClient.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data.fileId;
      });

      const attachmentIds = await Promise.all(uploadPromises);

      // Create ticket with attachment IDs
      const ticketData: CreateTicketRequest = {
        ...data,
        attachments: attachmentIds
      };

      return await ticketService.createTicket(ticketData);
    } catch (error) {
      console.error('Error in createTicketWithFiles:', error);
      throw error;
    }
  },

  /**
   * Get ticket details
   * @param id Ticket ID
   */
  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Update ticket
   * @param id Ticket ID
   * @param data Update data
   */
  updateTicket: async (id: string, data: UpdateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.put<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  /**
   * Delete ticket
   * @param id Ticket ID
   */
  deleteTicket: async (id: string): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  }
};

export default ticketService;