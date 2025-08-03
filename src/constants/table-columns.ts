import { UserData } from "@/types/table-data";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<UserData>[] = [
  {
    header: "Full Name",
    accessorKey: "name",
     enableSorting: true,
  },
  {
    header: "Date of Birth",
    accessorKey: "age",
    cell: (info) => {
      const rawDate = info.getValue() as string;
      if (!rawDate) return "N/A";
      return format(new Date(rawDate), "dd-MM-yyyy");
    },
     enableSorting: true,
  },
  {
    header: "Email",
    accessorKey: "email",
     enableSorting: true,
  },
  {
    header: "Phone",
    accessorKey: "phone",
     enableSorting: true,
  },
  {
    header: "Gender",
    accessorKey: "gender",
  },
];
