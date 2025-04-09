import apiClient from './apiClient';
import authService from './authService';
import ticketService from './ticketService';
import customerService from './customerService';
import organizationService from './organizationService';
import knowledgeBaseService from './knowledgeBaseService';
import slaService from './slaService';
import analyticsService from './analyticsService';
import preferencesService from './preferencesService';
import integrationService from './integrationService';

export {
  apiClient,
  authService,
  ticketService,
  customerService,
  organizationService,
  knowledgeBaseService,
  slaService,
  analyticsService,
  preferencesService,
  integrationService
};

// Type exports
export type { LoginRequest, RegisterRequest, AuthResponse } from './authService';
export type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketComment,
  CreateTicketCommentRequest,
  TicketListParams,
  TicketListResponse
} from './ticketService';
export type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerListParams,
  CustomerListResponse
} from './customerService';
export type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationListParams,
  OrganizationListResponse
} from './organizationService';
export type {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ArticleListParams,
  ArticleListResponse
} from './knowledgeBaseService';
export type {
  SLAPolicy,
  CreateSLAPolicyRequest,
  UpdateSLAPolicyRequest,
  SLAPolicyListParams,
  SLAPolicyListResponse
} from './slaService';
export type {
  TicketStatisticsParams,
  TicketStatistics,
  ResponseTimeAnalysis,
  SLAPerformance,
  AgentPerformance
} from './analyticsService';
export type {
  UserPreferences,
  UpdateUserPreferencesRequest
} from './preferencesService';
export type {
  EmailConfig,
  ChatWidgetConfig
} from './integrationService';