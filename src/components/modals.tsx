"use client";

import { CreateWorkspaceModal } from "@/src/features/workspaces/components/create-workspace-modal";

import { useEffect, useState } from "react";
import { CreateChannelModal } from "../features/channels/components/create-channel-modal";


export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; //potentially stopped a HYDRATION ERROR (idk what that is yet)
    
    return (
        <>
            <CreateChannelModal />
            <CreateWorkspaceModal />
        </>
    )
}