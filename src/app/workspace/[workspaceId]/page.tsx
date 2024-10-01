"use client";

import { useGetChannels } from "@/src/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/src/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/src/features/members/api/use-current-member";
import { useGetWorkspace } from "@/src/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/src/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useCreateChannelModal();

    const {data: member, isLoading: memberLoading} = useCurrentMember({ workspaceId });
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({ id: workspaceId });
    const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId});

    const channelId = useMemo(()=>channels?.[0]?._id, [channels]);
    const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

    useEffect (()=>{
        if(workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return;

        if(channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true);
        }
    }, [
        member,
        memberLoading,
        isAdmin,
        channelId,
        workspaceLoading,
        channelsLoading,
        workspace,
        open,
        setOpen,
        router,
        workspaceId,
    ]);

    if (workspaceLoading || channelsLoading || memberLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <Loader className="size-6 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    if(!workspace || !member) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <TriangleAlert className="size-6 text-muted-foreground"/>
                <span className="text-sm text-muted-foreground">
                    Workspace not found
                </span>
            </div>
        )
    }
    
    return (
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
            <TriangleAlert className="size-6 text-muted-foreground"/>
            <span className="text-sm text-muted-foreground">
                Channel not found
            </span>
        </div>
    )
};


export default WorkspaceIdPage;