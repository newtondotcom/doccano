import type { FetchOptions } from "ofetch";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig extends Omit<FetchOptions, "method" | "body" | "baseURL"> {
  headers?: Record<string, string>;
}

class ApiService {
  private baseURL: string | undefined;

  constructor() {
    this.baseURL = "v1"; // process.env.baseUrl;
  }

  private getCsrfToken(): string | undefined {
    if (import.meta.client) {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
    }
    return undefined;
  }

  private getHeaders(config: RequestConfig): Record<string, string> {
    const csrfToken = this.getCsrfToken();
    return {
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      ...config.headers,
    };
  }

  request<T = unknown>(
    method: HttpMethod,
    url: string,
    data: Record<string, unknown> = {},
    config: RequestConfig = {},
  ): Promise<T> {
    const { ...restConfig } = config;

    return $fetch<T>(url, {
      method,
      baseURL: this.baseURL,
      body: ["GET", "DELETE"].includes(method) ? undefined : data,
      headers: this.getHeaders(config),
      ...restConfig,
    });
  }

  get<T = unknown>(url: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>("GET", url, {}, config);
  }

  post<T = unknown>(
    url: string,
    data: Record<string, unknown> = {},
    config: RequestConfig = {},
  ): Promise<T> {
    return this.request<T>("POST", url, data, config);
  }

  put<T = unknown>(
    url: string,
    data: Record<string, unknown> = {},
    config: RequestConfig = {},
  ): Promise<T> {
    return this.request<T>("PUT", url, data, config);
  }

  patch<T = unknown>(
    url: string,
    data: Record<string, unknown> = {},
    config: RequestConfig = {},
  ): Promise<T> {
    return this.request<T>("PATCH", url, data, config);
  }

  delete<T = unknown>(
    url: string,
    data: Record<string, unknown> = {},
    config: RequestConfig = {},
  ): Promise<T> {
    return this.request<T>("DELETE", url, data, config);
  }
}

export default new ApiService();
