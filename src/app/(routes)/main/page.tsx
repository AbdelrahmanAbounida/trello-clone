"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentWorkSpaces } from "@/hooks/use-current-ws";
import { useWorkspaceModal } from "@/hooks/modals/use-ws-modal";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const MainPage = () => {
  const boards = [];
  const { isOpen, onOpen, onClose } = useWorkspaceModal();
  const user = useCurrentUser();
  const router = useRouter();
  const { data: allWorkspaces, isLoading } = useCurrentWorkSpaces(user?.id!);

  useEffect(() => {
    if (!isLoading && allWorkspaces && allWorkspaces?.length! > 0) {
      router.push(`/${allWorkspaces[0].id}/boards`);
    }
  }, [allWorkspaces]);

  return (
    <div className="h-full w-full ">
      {/** Loading State  */}

      {isLoading && <WorkSpacesLoading />}

      {/** Empty state with no Workspace  */}
      {allWorkspaces?.length == 0 && (
        <div className="h-full w-full flex items-center justify-center border rounded-md">
          <div className="flex max-w-lg mx-auto flex-col space-y-3 items-center justify-center">
            <div className="flex flex-col space-y-2 items-center justify-center text-center">
              <h1 className="text-xl font-bold">You have no Boards</h1>
              <h3 className="text-gray-500 text-sm">
                You can start Creating boards as soon as you create a workspace.
              </h3>
            </div>

            <Button
              onClick={onOpen}
              type="submit"
              variant={"secondary"}
              className="bg-sky-700 hover:bg-sky-600 text-white  transition-transform transform scale-100 active:scale-[0.97]"
            >
              Create Workspace
            </Button>
          </div>
        </div>
      )}

      {/** Empty Board List */}
      {}

      {/** Board Lists */}
    </div>
  );
};

export default MainPage;

const WorkSpacesLoading = () => (
  <div className="flex flex-col gap-3">
    {/** first line  */}
    <div className="flex items-center justify-start gap-2">
      <Skeleton className="w-[50px] h-[50px] rounded-md" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-[130px] h-[15px]" />
        <Skeleton className="w-[90px] h-[10px]" />
      </div>
    </div>
    {/** sep */}
    <Skeleton className="w-full h-[3px]" />

    {/** boards */}
    <div className="flex items-center gap-2">
      <Skeleton className="w-[150px] h-[20px]" />
    </div>
    <div className="flex w-full items-center gap-3 mt-2 flex-wrap">
      {[1, 2, 3, 4, 5].map((item, inedx) => (
        <Skeleton key={inedx} className="w-[220px]  h-[130px]" />
      ))}
    </div>
  </div>
);
