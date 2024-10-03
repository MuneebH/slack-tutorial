"use client";

import { useGetChannel } from "@/src/features/channels/api/use-get-channel";
import { useChannelId } from "@/src/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/src/features/messages/api/use-get-messages";
import { MessageList } from "@/src/components/message-list";

const ChannelIdPage = () => {
    const channelId = useChannelId();

    const { results, status, loadMore } = useGetMessages({ channelId });
    const {data: channel, isLoading: channelLoading} = useGetChannel({ id: channelId });

    console.log({results});
    if (channelLoading || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
                <Loader className="animate-spin size-5 text-muted-foreground"/>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
                <TriangleAlert className="size-5 text-muted-foreground"/>
                <span className="text-sm text-muted-foreground">
                    Channel not found
                </span>
            </div>
        );
    }
    
    return ( 
        <div className="flex flex-col h-full">             
            <Header title={channel.name}></Header>
            <MessageList
                channelName={channel.name}
                channelCreationTime={channel._creationTime}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status=== "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput placeholder={`Message # ${channel.name}`}/>
        </div>
     );
}
 
export default ChannelIdPage;