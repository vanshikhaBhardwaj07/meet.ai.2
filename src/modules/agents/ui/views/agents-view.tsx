"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { DataPagination } from "../components/data-pagination";
import { ErrorState } from "@/components/error-state";

import { columns } from "../components/columns";
import { EmptyState } from "@/components/ui/empty-state";
import { useAgentsFilters } from "@/app/(dashboard)/agents/hooks/use-agents-filters";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";



export const AgentsView = () => {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4c">
      {data.items.length === 0 ? (
        <EmptyState
          title="Create your first Agent"
          description=""
        />
      ) : (
        <>
          <DataTable
            data={data.items}
            columns={columns}
            onRowClick={(row) => router.push(`/agents/${row.id}`)}
          />
          <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
          />
        </>
      )}
    </div>
  );
};

// ✅ Added these two exports to fix the error
export const AgentsViewLoading = () => {
  return <LoadingState title={"Loading"} description={"Agents are loading"} />;
};
export const AgentsViewError = () => {
  return <ErrorState title={"Error"} description={"Something went wrong"} />;
};












