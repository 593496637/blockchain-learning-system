/**
 * API服务基础类
 * 为各个业务API服务提供通用的请求方法和错误处理
 */
import { httpClient } from '../utils/httpClient';
import type { ApiResponse } from '../types';

/**
 * API服务基础类
 * 所有业务API服务都应该继承此类
 */
export abstract class BaseService {
  protected client = httpClient;

  /**
   * 执行GET请求并处理响应
   * @param url 请求URL
   * @param errorMessage 自定义错误消息
   * @returns 响应数据
   */
  protected async get<T>(url: string, errorMessage?: string): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url);
    if (!response.success) {
      throw new Error(response.error || errorMessage || '请求失败');
    }
    return response.data!;
  }

  /**
   * 执行POST请求并处理响应
   * @param url 请求URL
   * @param data 请求数据
   * @param errorMessage 自定义错误消息
   * @returns 响应数据
   */
  protected async post<T>(url: string, data?: unknown, errorMessage?: string): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    if (!response.success) {
      throw new Error(response.error || errorMessage || '请求失败');
    }
    return response.data!;
  }

  /**
   * 执行PUT请求并处理响应
   * @param url 请求URL
   * @param data 请求数据
   * @param errorMessage 自定义错误消息
   * @returns 响应数据
   */
  protected async put<T>(url: string, data?: unknown, errorMessage?: string): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    if (!response.success) {
      throw new Error(response.error || errorMessage || '请求失败');
    }
    return response.data!;
  }

  /**
   * 执行DELETE请求并处理响应
   * @param url 请求URL
   * @param errorMessage 自定义错误消息
   * @returns 响应数据
   */
  protected async delete<T>(url: string, errorMessage?: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    if (!response.success) {
      throw new Error(response.error || errorMessage || '请求失败');
    }
    return response.data!;
  }

  /**
   * 安全请求包装器
   * @param request 请求函数
   * @returns 标准化的API响应
   */
  public async safeRequest<T>(request: () => Promise<T>): Promise<ApiResponse<T>> {
    return this.client.safeRequest(request);
  }

  /**
   * 获取消息类型的响应（通常用于操作成功的提示）
   * @param url 请求URL
   * @param data 请求数据
   * @param errorMessage 自定义错误消息
   * @returns 消息内容
   */
  protected async postForMessage(url: string, data?: unknown, errorMessage?: string): Promise<string> {
    const response = await this.client.post<ApiResponse>(url, data);
    if (!response.success) {
      throw new Error(response.error || errorMessage || '操作失败');
    }
    return response.message!;
  }
}