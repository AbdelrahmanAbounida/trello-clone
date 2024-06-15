"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpecificWorkspace } from "@/hooks/use-current-ws";
import React, { useEffect } from "react";
import { useCurrentBoards } from "@/hooks/use-current-boards";
import { redirect } from "next/navigation";
import { GoOrganization } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import { LuUser2 } from "react-icons/lu";
import { useActiveWorkspace } from "@/hooks/use-active-ws";
import BoardModal from "@/components/modals/board-modal";
import Link from "next/link";
import WorkshopHeader from "../../_components/workshop-header";
import { WorkspacePageParams } from "@/schemas/workspace-schema";
import { MAX_BOARDS_LIMIT } from "@/constants/payment";
import { useWSSubscription } from "@/hooks/use-ws-subscription";

// this page only in case of empty workspaces

const WorkspaceBoards = ({ params }: WorkspacePageParams) => {
  const { data: boards, isLoading } = useCurrentBoards(params.workspaceId);
  const { setActiveWs } = useActiveWorkspace();
  const { data: currentWorkspace, isLoading: WsLoading } = useSpecificWorkspace(
    params.workspaceId
  );
  const { data: isSubscribed, isLoading: subLoading } = useWSSubscription(
    params?.workspaceId
  );

  useEffect(() => {
    if (!WsLoading && !currentWorkspace) {
      redirect("/main");
    }
    setActiveWs(params.workspaceId);
  }, [WsLoading]);

  return (
    <div className="h-full w-full ">
      {/** Loading State  */}
      {(WsLoading || isLoading) && <WorkSpacesLoading />}
      {/** Empty state with no boards  */}
      {!isLoading && !WsLoading && (
        <div className="h-full w-full flex flex-col items-start p-2  rounded-md">
          {/** Navbar */}
          <WorkshopHeader currentWorkspace={currentWorkspace!} />

          {/** boards list */}
          <div className="flex flex-col my-4 mt-7 w-full">
            <div className="flex items-center gap-1">
              <LuUser2 size={35} />
              <p className="text-xl font-medium">Your Boards</p>
            </div>

            <div className="flex flex-wrap items-start gap-5 p-1 mt-5 w-full ">
              {boards?.map((board, index) => (
                <Link
                  href={`/${params.workspaceId}/${board.id}`}
                  key={index}
                  style={{ backgroundImage: `url(${board.backgroundImage})` }}
                  className={`w-[230px] h-[120px] border hover:opacity-95 opacity-100 cursor-pointer rounded-lg active:scale-[0.99] scale-100 relative`}
                >
                  <p className="absolute top-3 left-2 text-lg  text-white font-medium">
                    {board.title}
                  </p>
                </Link>
              ))}
              {boards?.length! < 5 && (
                <BoardModal>
                  <div
                    className={`w-[230px] h-[120px] cursor-pointer rounded-lg active:scale-[0.99] scale-100 bg-gray-100 hover:bg-gray-200/70 dark:bg-zinc-900 dark:hover:bg-zinc-900/80 text-black flex dark:text-white/80 flex-col items-center justify-center relative`}
                  >
                    <p className="text-lg">Create New Board</p>

                    {!subLoading && !isSubscribed && (
                      <p className="text-sm">
                        {MAX_BOARDS_LIMIT - boards?.length!} remaining
                      </p>
                    )}
                  </div>
                </BoardModal>
              )}

              {boards?.length! > 5 && !subLoading && isSubscribed && (
                <BoardModal>
                  <div
                    className={`w-[230px] h-[120px] cursor-pointer rounded-lg active:scale-[0.99] scale-100 bg-gray-100 hover:bg-gray-200/70 dark:bg-zinc-900 dark:hover:bg-zinc-900/80 text-black flex dark:text-white/80 flex-col items-center justify-center relative`}
                  >
                    <p className="text-lg">Create New Board</p>
                  </div>
                </BoardModal>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceBoards;

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
