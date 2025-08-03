"use client";
import React from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  Updater,
} from "@tanstack/react-table";
import { useInfiniteScrollVirtualTable } from "@/hooks/useTableData";
import { TablePlaceholder } from "../table-placeholder";
import SearchInput from "../search-input";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  sorting: SortingState;
  setSorting: (updaterOrValue: SortingState | Updater<SortingState>) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  isError = false,
  errorMessage,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  sorting,
  setSorting,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { tableContainerRef, rowVirtualizer, rows } =
    useInfiniteScrollVirtualTable({
      rows: table.getRowModel().rows,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    });

  const colCount = table.getHeaderGroups()[0]?.headers.length || 1;

  return (
    <>
      <SearchInput
        customPlaceholder="Search by name..."
        inputWrClasses="max-w-[250px] mb-4"
      />

      <div
        ref={tableContainerRef}
        className="overflow-scroll h-[80vh] min-w-[900px] mt-5"
      >
        <table className="w-full scroll-smooth text-sm text-left text-gray-500">
          <thead
            className="bg-blue-300 sticky top-0 z-10 text-xs text-gray-700 uppercase"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="contents">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 font-semibold tracking-wider cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: "↑",
                        desc: "↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody
            className="w-full relative"
            style={{
              height:
                isLoading || isError || rows.length === 0
                  ? "auto"
                  : `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {isLoading && (
              <tr>
                <td colSpan={colCount}>
                  <TablePlaceholder>Loading...</TablePlaceholder>
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={colCount}>
                  <TablePlaceholder>Error: {errorMessage}</TablePlaceholder>
                </td>
              </tr>
            )}

            {!isLoading && !isError && rows.length === 0 && (
              <tr>
                <td colSpan={colCount}>
                  <TablePlaceholder>No data found.</TablePlaceholder>
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              rows.length > 0 &&
              rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const row = rows[virtualItem.index];
                const isEven = virtualItem.index % 2 === 0;
                return (
                  <tr
                    key={row.id}
                    className={isEven ? "bg-blue-50" : "bg-blue-100"}
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${
                        row.getVisibleCells().length
                      }, minmax(0, 1fr))`,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>

        {isFetchingNextPage && (
          <div className="text-center py-2 text-gray-500 font-medium">
            Loading more...
          </div>
        )}
      </div>
    </>
  );
}
