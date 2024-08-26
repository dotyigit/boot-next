"use client";
import { formatDateTime } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { deleteEntry } from "./actions";

type EntryRow = Prisma.EntryGetPayload<{}>;

export const columns: ColumnDef<EntryRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          Created At
          <ArrowUpDown
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-2 h-4 w-4 text-gray-500 cursor-pointer hover:bg-gray-200 rounded-md transition-colors"
          />
        </div>
      );
    },
    cell: ({ row }) => {
      return formatDateTime(row.original.createdAt);
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return formatDateTime(row.original.updatedAt);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Trash2
            className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700"
            onClick={async () => {
              const result = await deleteEntry({ id: row.original.id });
            }}
          />
        </div>
      );
    },
  },
];
