'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactNode } from "react"

const TansatckLayout = ({ children }: { children: ReactNode }) => {
      const queryClientRef = React.useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 5,
        },
    },
});
  }
    return(
         <QueryClientProvider client={queryClientRef.current}>\
             {children}
         </QueryClientProvider>
    )
}

export default TansatckLayout