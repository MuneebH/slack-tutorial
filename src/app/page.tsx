"use client";

import { useEffect, useMemo } from "react";

import { useGetWorkspaces } from "../features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "../features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();
  //picking the first in the array, also being careful as it can be undefined
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
      console.log("Redirect to workspace");
    } else if (!open) {
      // makes the user forced to open a workspace, if there are no workspaces, u can't even close dialog (setopen is true)
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground"></Loader>
    </div>
  );
}
