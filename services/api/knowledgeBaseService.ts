import apiClient from './apiClient';

export interface Article {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  status: 'draft' | 'published';
  visibility: 'public' | 'private';
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  categoryId: string;
  tags?: string[];
  status: 'draft' | 'published';
  visibility: 'public' | 'private';
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  categoryId?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  visibility?: 'public' | 'private';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentId?: string;
}

export interface ArticleListParams {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ArticleListResponse {
  articles: Article[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

/**
 * 知识库服务，提供文章和分类的增删改查功能
 */
const knowledgeBaseService = {
  /**
   * 创建文章
   * @param data 文章创建请求数据
   */
  createArticle: async (data: CreateArticleRequest): Promise<Article> => {
    const response = await apiClient.post<Article>('/knowledge-base/articles', data);
    return response.data;
  },
  
  /**
   * 获取文章列表
   * @param params 过滤和分页参数
   */
  getArticles: async (params?: ArticleListParams): Promise<ArticleListResponse> => {
    const response = await apiClient.get<ArticleListResponse>('/knowledge-base/articles', { params });
    return response.data;
  },
  
  /**
   * 获取文章详情
   * @param id 文章ID
   */
  getArticleById: async (id: string): Promise<Article> => {
    const response = await apiClient.get<Article>(`/knowledge-base/articles/${id}`);
    return response.data;
  },
  
  /**
   * 更新文章
   * @param id 文章ID
   * @param data 更新数据
   */
  updateArticle: async (id: string, data: UpdateArticleRequest): Promise<Article> => {
    const response = await apiClient.put<Article>(`/knowledge-base/articles/${id}`, data);
    return response.data;
  },
  
  /**
   * 删除文章
   * @param id 文章ID
   */
  deleteArticle: async (id: string): Promise<void> => {
    await apiClient.delete(`/knowledge-base/articles/${id}`);
  },
  
  /**
   * 创建分类
   * @param data 分类创建请求数据
   */
  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/knowledge-base/categories', data);
    return response.data;
  },
  
  /**
   * 获取分类列表
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/knowledge-base/categories');
    return response.data;
  },
  
  /**
   * 获取分类详情
   * @param id 分类ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/knowledge-base/categories/${id}`);
    return response.data;
  },
  
  /**
   * 更新分类
   * @param id 分类ID
   * @param data 更新数据
   */
  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put<Category>(`/knowledge-base/categories/${id}`, data);
    return response.data;
  },
  
  /**
   * 删除分类
   * @param id 分类ID
   */
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/knowledge-base/categories/${id}`);
  }
};

export default knowledgeBaseService; 