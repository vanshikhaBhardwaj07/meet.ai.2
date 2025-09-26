"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import {DataTable } from "../components/data-table";
import { ErrorState } from "@/components/error-state";
import {columns} from "../components/columns";
import { EmptyState } from "@/components/ui/empty-state";


export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

   return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex-col gap-y-2">
      
      {data.length === 0 && (
        <EmptyState
        title="Create your first agent"
        description="Create an agent to join your meetings. Each agent will follow your instructions and can with participants during the call"
          />
      )}
    </div>
  );
};

export const AgentsViewLoading = () => (
  <LoadingState title="Loading Agents" description="" />
);

export const AgentsViewError = () => (
  <ErrorState title="Error Loading Agents" description="" />
);