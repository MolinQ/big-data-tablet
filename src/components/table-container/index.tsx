"use client";

import React, { useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { columns } from "@/constants/table-columns";
import { TablePlaceholder } from "../table-placeholder";

interface TableContainerProps {
  data: any[];
  error: unknown;
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  data,
  error,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 57,
    overscan: 5,
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (
      virtualItems.length &&
      virtualItems[virtualItems.length - 1].index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    rows.length,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  ]);

  return (
    <div
      ref={tableContainerRef}
      className="overflow-auto"
      style={{ height: "75vh" }}
    >
      {isLoading ? (
        <TablePlaceholder>Loading initial data...</TablePlaceholder>
      ) : error ? (
        <TablePlaceholder>Error: {(error as Error).message}</TablePlaceholder>
      ) : rows.length === 0 ? (
        <TablePlaceholder>No data found.</TablePlaceholder>
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 sticky top-0 z-10 text-xs text-gray-700 uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 font-semibold tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            className="w-full relative"
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const row = rows[virtualItem.index];
              const isEven = virtualItem.index % 2 === 0;
              return (
                <tr
                  key={row.id}
                  className={`${
                    isEven ? "bg-white" : "bg-gray-50"
                  } hover:bg-sky-100 grid grid-cols-4`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    borderBottomWidth: "1px",
                    borderColor: "#E5E7EB",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap"
                      style={{ width: cell.column.getSize() }}
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
      )}
    </div>
  );
};
