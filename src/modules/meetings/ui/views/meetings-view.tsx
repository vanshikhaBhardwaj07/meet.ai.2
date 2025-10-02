"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
export const MeetingsView = () => {
    const trpc = useTRPC();
    const  { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
    return (
        <div className="overflow-x-scroll">
          {/*JSON.stringify(data)*/}
        </div>
    )
}
export const MeetingsViewLoading = () => {
  return <LoadingState 
  title="Loading Agents"
   description="" />;
};


export const meetingsViewError = () => {
  return (
    <ErrorState
      title={"Error loading agents"}
      description={"something went wrong"}
    />
  );
};