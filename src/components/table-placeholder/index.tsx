import React from "react";

export const TablePlaceholder = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-center h-40 text-gray-500">
    {children}
  </div>
);
