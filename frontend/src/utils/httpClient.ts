/**
 * HTTP客户端封装
 * 基于axios的统一请求配置和拦截器
 */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '../types';

/**
 * HTTP客户端类
 * 封装axios的基本配置和通用方法
 */
export class HttpClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 可以在这里添加token等认证信息
        return config;
      },
      (error) => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('API请求错误:', error);
        
        // 可以在这里统一处理不同的错误状态码
        if (error.response) {
          switch (error.response.status) {
            case 404:
              console.error('请求的资源不存在');
              break;
            case 500:
              console.error('服务器内部错误');
              break;
            default:
              console.error(`请求失败: ${error.response.status}`);
          }
        } else if (error.request) {
          console.error('网络连接错误');
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET请求
   * @param url 请求URL
   * @param config 请求配置
   * @returns 响应数据
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  /**
   * POST请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE请求
   * @param url 请求URL
   * @param config 请求配置
   * @returns 响应数据
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  /**
   * 安全请求包装器，自动处理错误并返回标准化响应
   * @param request 请求函数
   * @returns 标准化的API响应
   */
  async safeRequest<T>(request: () => Promise<T>): Promise<ApiResponse<T>> {
    try {
      const data = await request();
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 获取axios实例（用于需要直接访问axios功能的场景）
   * @returns axios实例
   */
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建默认的HTTP客户端实例
const API_BASE_URL = 'http://localhost:3001/api';
export const httpClient = new HttpClient(API_BASE_URL);

// 导出默认实例
export default httpClient;