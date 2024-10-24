import { Button } from "@/src/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/src/components/ui/dialog"
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { useUpdateChannel } from "@/src/features/channels/api/use-update-channel";
import { useChannelId } from "@/src/hooks/use-channel-id";
import { toast } from "sonner";
import { useRemoveChannel } from "@/src/features/channels/api/use-remove-channel";
import { useConfirm } from "@/src/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/src/hooks/use-workspace-id";
import { useCurrentMember } from "@/src/features/members/api/use-current-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

interface HeaderProps { 
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;
};

export const Header = ({
    memberName = "Member",
    memberImage,
    onClick
}: HeaderProps) => {
    const avatarFallBack = memberName.charAt(0).toUpperCase();

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Button
                variant = "ghost"
                className="text-lg font-semibold px-2 overflow-hidden w-auto"
                size="sm"
                onClick={onClick}
            >
                <Avatar className="size-6 mr-2">
                    <AvatarImage src={memberImage}/>
                    <AvatarFallback>
                        {avatarFallBack}
                    </AvatarFallback>
                </Avatar>
                <span className="truncate">{memberName}</span>
                <FaChevronDown className="size-2.5 ml-2"/>
            </Button>
        </div>
    )
}