import {
  INITIAL_PAGE_PARAM,
  SEARCH_PARAMS,
  SORTING_TYPES,
} from "@/constants/users-params-data";
import UserTable from "@/layouts/tablet";
import { DataService } from "@/services/DataService";
import { InfiniteData } from "@tanstack/react-query";
import { ApiResponse } from "@/types/table-data";
import { TEXT_EMPTY_FIELDS } from "@/constants/initial-components-value";

const dataService = new DataService();

export default async function Home() {
  const initialPageData = await dataService.getData(
    INITIAL_PAGE_PARAM,
    SEARCH_PARAMS.DEFAULT_VALUE,
    SORTING_TYPES.DEFAULT,
    SORTING_TYPES.ASC,
    TEXT_EMPTY_FIELDS
  );

  const initialData: InfiniteData<ApiResponse, number> = {
    pages: [initialPageData],
    pageParams: [INITIAL_PAGE_PARAM],
  };

  return <UserTable initialData={initialData} />;
}
