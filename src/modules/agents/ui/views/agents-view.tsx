"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/ui/empty-state";
   

export const AgentsView = () => {
    const trpc =useTRPC();
    const { data }= useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return(
       <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4c">
        <DataTable  data={data} columns={columns}/>
        {data.length===0 &&(
            <EmptyState
            title="Create your first Logo"
            description=" create an agent to join meetings"
            />
        )}

       </div>
    )
}
export const AgentsViewLoading = () => {
    return (
      <LoadingState
      title="Loading Agents"
      description=" this may take a ew seconds"
      />
    )
}