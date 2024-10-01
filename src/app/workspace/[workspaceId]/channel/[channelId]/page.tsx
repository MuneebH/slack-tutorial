"use client";

import { useGetChannel } from "@/src/features/channels/api/use-get-channel";
import { useChannelId } from "@/src/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";

const ChannelIdPage = () => {
    const channelId = useChannelId();

    const {data: channel, isLoading: channelLoading} = useGetChannel({ id: channelId });

    if (channelLoading) {
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
            <div className="flex-1"/>
            <ChatInput placeholder={`Message # ${channel.name}`}/>
        </div>
     );
}
 
export default ChannelIdPage;