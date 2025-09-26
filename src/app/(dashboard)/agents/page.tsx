import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  AgentsView,
  AgentsViewLoading,
  AgentsViewError,
} from "@/modules/agents/ui/views/agents-view";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function Page() {
     const session = await auth.api.getSession({
        headers: await headers(),
      });
    
      if(!session){
        redirect("/sign-in");
      }
      


  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
    <AgentsListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    </>
  );
}
