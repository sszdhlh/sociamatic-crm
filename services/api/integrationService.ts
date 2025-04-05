import apiClient from './apiClient';

export interface EmailConfig {
  inboundSettings: {
    protocol: string;
    host: string;
    port: number;
    credentials: Record<string, any>;
  };
  outboundSettings: {
    protocol: string;
    host: string;
    port: number;
    credentials: Record<string, any>;
  };
}

export interface ChatWidgetConfig {
  widgetSettings: {
    title: string;
    theme: Record<string, any>;
    position: string;
  };
  routingRules: Record<string, any>;
}

/**
 * 集成服务，提供配置邮件和聊天集成的功能
 */
const integrationService = {
  /**
   * 配置邮件集成
   * @param data 邮件配置数据
   */
  configureEmailIntegration: async (data: EmailConfig): Promise<EmailConfig> => {
    const response = await apiClient.post<EmailConfig>('/integrations/email/config', data);
    return response.data;
  },
  
  /**
   * 获取邮件集成配置
   */
  getEmailIntegrationConfig: async (): Promise<EmailConfig> => {
    const response = await apiClient.get<EmailConfig>('/integrations/email/config');
    return response.data;
  },
  
  /**
   * 配置聊天集成
   * @param data 聊天组件配置数据
   */
  configureChatIntegration: async (data: ChatWidgetConfig): Promise<ChatWidgetConfig> => {
    const response = await apiClient.post<ChatWidgetConfig>('/integrations/chat/config', data);
    return response.data;
  },
  
  /**
   * 获取聊天集成配置
   */
  getChatIntegrationConfig: async (): Promise<ChatWidgetConfig> => {
    const response = await apiClient.get<ChatWidgetConfig>('/integrations/chat/config');
    return response.data;
  }
};

export default integrationService; 