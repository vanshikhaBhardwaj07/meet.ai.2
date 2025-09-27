import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import type { SearchParams } from "nuqs";

import { getQueryClient, trpc } from "@/trpc/server";
import {
  AgentsView,
  AgentsViewLoading,
  AgentsViewError
} from "@/modules/agents/ui/views/agents-view";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);
  const session = await auth.api.getSession({
    headers: await headers(),
  })


  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
  ...filters
  }));

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading />}>
          <AgentsView />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
export default Page;

