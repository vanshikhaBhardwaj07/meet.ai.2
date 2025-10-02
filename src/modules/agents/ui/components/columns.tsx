"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentsGetMany } from "../../types";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";

import { Badge } from "@/components/ui/badge";
import { CornerRightDownIcon } from "lucide-react";
import { VideoIcon } from "lucide-react";

export const columns: ColumnDef<AgentsGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (

      <div className="flex items-center gap-x-2">

        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.name}
            className="size-6"
          />

          <span className="font-semibold capitalize ">{row.original.name}</span>
        </div>
        <div className="flex items-center gap-x-1">
          <div className="flex items-center gap-x-1">
            <CornerRightDownIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
            {row.original.instructions}
            </span>
          </div>

        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",

    cell: ({ row }) => (
        <Badge
         variant="outline"
         className="flex items-center gap-x-2"
        
        >
         <VideoIcon className="text-black-700"/>

        </Badge>
    )

  }

];
