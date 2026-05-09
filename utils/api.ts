import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.request.get(endpoint);
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await this.request.post(endpoint, { data: body });
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await this.request.put(endpoint, { data: body });
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async delete(endpoint: string): Promise<void> {
    const response = await this.request.delete(endpoint);
    expect(response.ok()).toBeTruthy();
  }
}
