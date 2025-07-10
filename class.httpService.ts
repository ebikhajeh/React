
import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "../types/apiResponse";

export default class HttpService<T> {
  private axiosInstance: AxiosInstance;
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:3000",
    });
  }

  getAll = (): Promise<ApiResponse<T[]>> => {
    return this.axiosInstance.get<ApiResponse<T[]>>(this.endpoint).then(res => res.data);
  };

  get = (id: number | string): Promise<ApiResponse<T>> => {
    return this.axiosInstance.get<ApiResponse<T>>(`${this.endpoint}/${id}`).then(res => res.data);
  };

  post = (data: T): Promise<ApiResponse<T>> => {
    return this.axiosInstance.post<ApiResponse<T>>(this.endpoint, data).then(res => res.data);
  };

  put = (id: number | string, data: T): Promise<ApiResponse<T>> => {
    return this.axiosInstance.put<ApiResponse<T>>(`${this.endpoint}/${id}`, data).then(res => res.data);
  };

  delete = (id: number | string): Promise<ApiResponse<void>> => {
    return this.axiosInstance.delete<ApiResponse<void>>(`${this.endpoint}/${id}`).then(res => res.data);
  };

  getByPath = (path: string): Promise<ApiResponse<T[]>> => {
    return this.axiosInstance.get<ApiResponse<T[]>>(`${this.endpoint}/${path}`).then(res => res.data);
  };
}
