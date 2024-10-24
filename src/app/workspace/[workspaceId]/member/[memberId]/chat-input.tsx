import { Id } from "@/convex/_generated/dataModel";
import { useCreateMessage } from "@/src/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/src/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/src/hooks/use-channel-id";
import { useWorkspaceId } from "@/src/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ChatInputProps {
    placeholder: string;
    conversationId: Id<"conversations">;
};

type CreateMessageValues = {
    conversationId: Id<"conversations">;
    workspaceId: Id<"workspaces">;
    body: string;
    image?: Id<"_storage"> | undefined;
};

const Editor = dynamic(() => import("@/src/components/editor"), {ssr: false});

export const ChatInput = ({placeholder, conversationId}: ChatInputProps) => { 
    const[editorKey, setEditorKey] = useState(0);
    const[isPending, setIsPending] = useState(false);
    
    const editorRef = useRef<Quill | null>(null);

    const workspaceId = useWorkspaceId();

    const { mutate: generateUploadUrl } = useGenerateUploadUrl();
    const { mutate: createMessage } = useCreateMessage();

    const handleSubmit = async ({
        body,
        image
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setIsPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                conversationId,
                workspaceId,
                body,
                image: undefined,
            };


            if(image) {
                const url = await generateUploadUrl({}, { throwError: true});
                
                if(!url) {
                    throw new Error("URL not found");
                }

                const result = await fetch(url, {
                    method: "POST",
                    headers: {"Content-type": image.type},
                    body:image,
                })
                if (!result.ok) {
                    throw new Error("Failed to upload image");
                }

                const {storageId} = await result.json();

                values.image = storageId;
            }

            await createMessage (values, { throwError: true });

            setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
            editorRef?.current?.enable(true);
        }
    };

    return (
        <div className="px-5 w-full">
            <Editor
                key={editorKey}
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    );
};