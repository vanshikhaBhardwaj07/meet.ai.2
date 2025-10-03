"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useConfirm } from "@/hooks/use-confirm";
import { MeetingIdViewHeader } from "@/modules/agents/ui/components/meeting-id-view-header";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";

interface Props {
    meetingId: string;
};

export const MeetingIdView = ({ meetingId }: Props) => {
const trpc = useTRPC();
const queryClient = useQueryClient();
const router =useRouter();
const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

const [RemoveConfirmation, ConfirmRemove] = useConfirm(
    "Are you sure?",
    "The following action will reove this meeting"
)


const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id:meetingId})
)

const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
       onSuccess: () => {
       queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
      //TODO: Invalidate free tier usage
      router.push("/meetings");
       },
       
    })

)

const handleRemoveMeeting = async () => {
    const ok = await ConfirmRemove();

    if(!ok) return;

    await removeMeeting.mutateAsync({ id: meetingId});
}

    return (
        <>

        <RemoveConfirmation/>
        <UpdateMeetingDialog
          open={updateMeetingDialogOpen}
          onOpenChange={setUpdateMeetingDialogOpen}
          initialValues={data}
        
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <MeetingIdViewHeader
              meetingId={meetingId}
              meetingName={data.name}
              onEdit={() => setUpdateMeetingDialogOpen(true)}
              onRemove={handleRemoveMeeting}
            />
          {JSON.stringify(data, null, 2)}
        </div>
        </>
    )
}
export const MeetingIdViewLoading = () => {
    return (
        <LoadingState
        title="Loading Meeting"
        description=""
        />
    )
}
export const MeetingIdViewError = () => {
    return (
        <ErrorState
        title="Error Loading meeting"
        description=""
        />
    )
}