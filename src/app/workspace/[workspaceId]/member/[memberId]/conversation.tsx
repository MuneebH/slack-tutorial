import { Id } from "@/convex/_generated/dataModel";
import { useGetMember } from "@/src/features/members/api/use-get-member";
import { useGetMessages } from "@/src/features/messages/api/use-get-messages";
import { useMemberId } from "@/src/hooks/use-member-id";
import { Loader } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/src/components/message-list";
import { usePanel } from "@/src/hooks/use-panel";

interface ConversationProps {
    id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
    const memberId = useMemberId();

    const { onOpenProfile } = usePanel();

    const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
    const { results, status, loadMore} = useGetMessages({
        conversationId: id,
    });

    if(memberLoading || status == "LoadingFirstPage") {
        return ( 
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <Loader className="size-6 animate-spin text-muted-foreground"/>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col h-full">
            <Header 
                memberName={member?.user.name}
                memberImage={member?.user.image}
                onClick={() => onOpenProfile(memberId)}
            />
            <MessageList 
                data={results}
                variant="conversation"
                memberImage={member?.user.image}
                memberName={member?.user.name}
                loadMore={loadMore}
                isLoadingMore={status == "LoadingMore"}
                canLoadMore={status == "CanLoadMore"}
            />
            <ChatInput 
                placeholder={`Message ${member?.user.name}`}
                conversationId={id}
            />
        </div>
    );
};