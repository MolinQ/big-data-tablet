import { ApiResponse } from "@/types/table-data";
import { HttpService } from "./HttpService";
import {
  SEARCH_PARAMS,
  SEARCH_TEXT_PARAMS,
  SORTED_BY_PARAMS,
  SORTED_ORDER_PARAMS,
} from "@/constants/users-params-data";

export class DataService extends HttpService {
  async getData(
    page: number,
    limit = 20,
    sortBy?: string,
    sortOrder?: string,
    search?: string
  ): Promise<ApiResponse> {
    const params = new URLSearchParams();

    if (page !== undefined) {
      params.append(SEARCH_PARAMS.PAGE, String(page));
    }

    if (limit !== undefined) {
      params.append(SEARCH_PARAMS.LIMIT, String(limit));
    }

    if (search && search.trim() !== "") {
      params.append(SEARCH_TEXT_PARAMS.NAME, search);
    }

    if (sortBy) {
      params.append(SORTED_BY_PARAMS.NAME, sortBy);
    }

    if (sortOrder) {
      params.append(SORTED_ORDER_PARAMS.NAME, sortOrder);
    }

    return this.get(`/api/v1/data-table?${params.toString()}`);
  }
}
