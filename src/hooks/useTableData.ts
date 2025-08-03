import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Row } from "@tanstack/react-table";

interface Props {
  rows: Row<any>[];
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage?: boolean;
}

export const useInfiniteScrollVirtualTable = ({
  rows,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: Props) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const lastIndexRef = useRef<number>(-1);

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (
      virtualItems.length > 0 &&
      virtualItems[virtualItems.length - 1].index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      const lastIndex = virtualItems[virtualItems.length - 1].index;
      fetchNextPage();
      lastIndexRef.current = lastIndex;
    }
  }, [
    rows.length,
    rowVirtualizer.getVirtualItems(),
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return {
    tableContainerRef,
    rowVirtualizer,
    rows,
  };
};
