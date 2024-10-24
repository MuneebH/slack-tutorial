import { useCurrentMember } from "@/src/features/members/api/use-current-member";
import { useGetWorkspace } from "@/src/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/src/hooks/use-workspace-id";
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizontal } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/src/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/src/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/src/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/src/hooks/use-channel-id";
import { useMemberId } from "@/src/hooks/use-member-id";

export const WorkspaceSidebar  = () => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const memberId = useMemberId();

    const [_open, setOpen] = useCreateChannelModal();

    const {data: member, isLoading: memberLoading } = useCurrentMember({workspaceId });
    const {data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId }); 
    const {data: channels, isLoading: channelsLoading } = useGetChannels({workspaceId});
    const {data: members, isLoading: membersLoading } = useGetMembers({workspaceId});
    if (workspaceLoading || memberLoading) {
        return (
            <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-white"/>
            </div>
        );
    }

    if (!workspace || !member) {
        return (
            <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
                <AlertTriangle className="size-5 animate-spin text-white"/>
                <p className="text-white text-sm">
                    Workspace not found
                </p>
            </div>
        );
    }

    return ( 
        <div className="flex flex-col bg-[#5E2C5F] h-full">
            <WorkspaceHeader workspace = {workspace} isAdmin={member.role === "admin"}/>
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem
                    label="Threads"
                    icon={MessageSquareText}
                    id="threads"   
                />
                <SidebarItem
                    label="Drafts & Sent"
                    icon={SendHorizontal}
                    id="drafts"   
                />
            </div>
            <WorkspaceSection
                label="Channels"
                hint="New channel"
                onNew={member.role === "admin" ? () => setOpen(true) : undefined}
            >
                {channels?.map((item) =>
                    <SidebarItem
                        key={item._id}
                        icon={HashIcon}
                        label={item.name}
                        id = {item._id}
                        variant={channelId === item._id ? "active" : "default"}
                    />
                )}                    
            </WorkspaceSection>
            <WorkspaceSection
                label="Direct Messages"
                hint="New direct message"
                onNew={()=>{}}
            >
                {members?.map((item) => (
                    <UserItem  
                        key={item._id}
                        id={member._id}
                        label={item.user.name}
                        image={item.user.image}
                        variant={item._id === memberId ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>
        </div>
     )
};