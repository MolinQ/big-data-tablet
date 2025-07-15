import { HttpService } from "./HttpService";

export interface ApiResponse {
  results: any[];
  info: {
    page: number;
  };
}

export class DataService extends HttpService {
  async getData(page: number = 1, limit: number = 50): Promise<ApiResponse> {
    return this.get(`/api/?page=${page}&results=${limit}`);
  }
}