import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class HttpClient {
  private readonly instance: AxiosInstance;

  constructor(baseURL: string, headers: any) {
    this.instance = axios.create({
      baseURL: baseURL,
      headers: headers,
    });
  }

  public async get<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return response.data;
    } catch (e) {
      throw JSON.stringify(e.response.data);
    }
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export default HttpClient;
