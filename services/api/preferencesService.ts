import apiClient from './apiClient';

export interface UserPreferences {
  notifications: {
    email: boolean;
    inApp: boolean;
    desktop: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export interface UpdateUserPreferencesRequest {
  notifications?: {
    email?: boolean;
    inApp?: boolean;
    desktop?: boolean;
  };
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
}

/**
 * 用户偏好设置服务，提供获取和更新用户偏好设置的功能
 */
const preferencesService = {
  /**
   * 获取用户偏好设置
   */
  getUserPreferences: async (): Promise<UserPreferences> => {
    const response = await apiClient.get<UserPreferences>('/preferences');
    return response.data;
  },
  
  /**
   * 更新用户偏好设置
   * @param data 更新数据
   */
  updateUserPreferences: async (data: UpdateUserPreferencesRequest): Promise<UserPreferences> => {
    const response = await apiClient.put<UserPreferences>('/preferences', data);
    return response.data;
  }
};

export default preferencesService; 