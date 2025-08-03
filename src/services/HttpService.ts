import {
  NETWORK_ERROR,
  UNHANDLED_NETWORK_ERROR,
} from "@/constants/api-messages";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor() {
    this.axiosInstance.interceptors.request.use((config) => {
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
      return config;
    });
  }

  private setupResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response) => Promise.resolve(response.data),
      (error) => {
        if (!error.response) {
          return Promise.reject(NETWORK_ERROR);
        }

        const serverErrorMessage =
          error.response.data?.message || UNHANDLED_NETWORK_ERROR;
        return Promise.reject(serverErrorMessage);
      }
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .get<T>(url, config)
      .then((response) => response as T);
  }
}
