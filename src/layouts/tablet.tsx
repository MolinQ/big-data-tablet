"use client";
import React, { useEffect, useMemo, useState } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { DataService } from "@/services/DataService";
import { DataTable } from "@/components/table-data";
import { columns } from "@/constants/table-columns";
import { ApiResponse, UserData } from "@/types/table-data";
import {
  INITIAL_PAGE_PARAM,
  QUERRY_KEY,
  SEARCH_PARAMS,
  SEARCH_TEXT_PARAMS,
  SORTED_BY_PARAMS,
  SORTED_ORDER_PARAMS,
  SORTING_TYPES,
} from "@/constants/users-params-data";
import { SortingState, Updater } from "@tanstack/react-table";
import { isFunction } from "@/helpers/types-guard";

const dataService = new DataService();

const UserTable = ({
  initialData,
}: {
  initialData: InfiniteData<ApiResponse, number>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortBy =
    searchParams.get(SORTED_BY_PARAMS.NAME) || SORTING_TYPES.DEFAULT;
  const sortOrder =
    searchParams.get(SORTED_ORDER_PARAMS.NAME) === SORTING_TYPES.DESC
      ? SORTING_TYPES.DESC
      : SORTING_TYPES.ASC;

  const search = useMemo(
    () =>
      searchParams.get(SEARCH_TEXT_PARAMS.NAME)?.trim() ||
      SEARCH_TEXT_PARAMS.DEFAULT_FIELD,
    [searchParams]
  );

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: sortOrder === SORTING_TYPES.DESC }]
    : [];

  const setSorting = (updater: Updater<SortingState>) => {
    const next = isFunction(updater) ? updater(sorting) : updater;

    const params = new URLSearchParams(window.location.search);

    if (next.length !== 0) {
      const [first] = next;
      params.set(SORTED_BY_PARAMS.NAME, first.id);
      params.set(
        SORTED_ORDER_PARAMS.NAME,
        first.desc ? SORTING_TYPES.DESC : SORTING_TYPES.ASC
      );
    } else {
      params.delete(SORTED_BY_PARAMS.NAME);
      params.delete(SORTED_ORDER_PARAMS.NAME);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const hasQueryParams = Array.from(searchParams.keys()).length > 0;

  const queryInitialData = hasQueryParams ? undefined : initialData;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [...QUERRY_KEY, sortBy, sortOrder, search],
    queryFn: async ({ pageParam = INITIAL_PAGE_PARAM }) => {
      return await dataService.getData(
        pageParam,
        SEARCH_PARAMS.DEFAULT_VALUE,
        sortBy,
        sortOrder,
        search
      );
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: INITIAL_PAGE_PARAM,
    staleTime: 1000 * 60,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    initialData: queryInitialData,
  });

  const users = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="p-6">
      <DataTable<UserData>
        data={users}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
};

export default UserTable;
