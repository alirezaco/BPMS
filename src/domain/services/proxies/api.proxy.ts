import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { RunningMessageEnum } from 'infrastructure/enum';
import { ApiInterface } from 'infrastructure/interfaces';

@Injectable()
export class ApiProxy {
  private apiServer: AxiosInstance = axios.create();

  constructor() {}

  async get(
    url: string,
    headers?: Record<string, string>,
    query?: Record<string, string>,
  ) {
    const res = await this.apiServer.get(url, { headers, params: query });
    return res.data;
  }

  async post(
    url: string,
    data: any,
    headers?: Record<string, string>,
    query?: Record<string, string>,
  ) {
    const res = await this.apiServer.post(url, data, {
      headers,
      params: query,
    });
    return res.data;
  }

  async put(
    url: string,
    data: any,
    headers?: Record<string, string>,
    query?: Record<string, string>,
  ) {
    const res = await this.apiServer.put(url, data, { headers, params: query });
    return res.data;
  }

  async delete(
    url: string,
    headers?: Record<string, string>,
    query?: Record<string, string>,
  ) {
    const res = await this.apiServer.delete(url, { headers, params: query });
    return res.data;
  }

  async patch(
    url: string,
    data: any,
    headers?: Record<string, string>,
    query?: Record<string, string>,
  ) {
    const res = await this.apiServer.patch(url, data, {
      headers,
      params: query,
    });
    return res.data;
  }

  async head(
    url: string,
    headers?: Record<string, string>,
    query?: Record<string, string>,
  ) {
    const res = await this.apiServer.head(url, { headers, params: query });
    return res.data;
  }

  async request(api: ApiInterface): Promise<any> {
    let { url, method, headers, params, body, query } = api;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
      });
    }

    if (method === 'GET') {
      return this.get(url, headers, query);
    } else if (method === 'POST') {
      return this.post(url, body, headers, query);
    } else if (method === 'PUT') {
      return this.put(url, body, headers, query);
    } else if (method === 'DELETE') {
      return this.delete(url, headers, query);
    } else if (method === 'PATCH') {
      return this.patch(url, body, headers, query);
    } else if (method === 'HEAD') {
      return this.head(url, headers, query);
    }

    throw new Error(RunningMessageEnum.INVALID_METHOD);
  }
}
