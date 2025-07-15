'use client'
import { DataService } from "@/services/DataService";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import React, { useRef, useEffect } from "react";
import { useVirtualizer } from '@tanstack/react-virtual';

const dataService = new DataService();

const TablePlaceholder = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center h-40 text-gray-500">
    {children}
  </div>
);


const Tablet = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["tableData"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await dataService.getData(pageParam);
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const tableData = React.useMemo(() => {
    return data?.pages.flatMap(page => page.results) ?? [];
  }, [data]);

  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      header: "Full Name",
      accessorFn: (row) =>
        `${row.name?.first ?? ""} ${row.name?.last ?? ""}`,
      id: "fullName",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Location",
      accessorFn: (row) =>
        `${row.location?.city}, ${row.location?.country}`,
      id: "location",
    },
  ], []);

  const table = useReactTable({
    data: tableData,
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
    if (virtualItems.length === 0) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= rows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    rows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="shadow-sm overflow-hidden rounded-lg border border-gray-200">
          <div
            ref={tableContainerRef}
            className="overflow-auto" 
            style={{ height: '75vh' }}
          >
            {isLoading ? (
                <TablePlaceholder>Loading initial data...</TablePlaceholder>
            ) : error ? (
                <TablePlaceholder>Error: {error.message}</TablePlaceholder>
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
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody 
                className={`w-full relative`}
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}>
                  {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                    const row = rows[virtualItem.index];
                    const isEven = virtualItem.index % 2 === 0;
                    return (
                      <tr
                        key={row.id}
                        className={`${isEven ? 'bg-white' : 'bg-gray-50'} hover:bg-sky-100 grid grid-cols-4`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                          borderBottomWidth: '1px',
                          borderColor: '#E5E7EB', 
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap"
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {isFetchingNextPage && (
          <div className="text-center p-4 text-gray-500 font-medium">
            Loading more users...
          </div>
        )}
      </div>
    </div>
  );
};

export default Tablet;