"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpecificWorkspace } from "@/hooks/use-current-ws";
import React, { useEffect } from "react";
import { useCurrentBoards } from "@/hooks/use-current-boards";
import { redirect } from "next/navigation";
import { LuUser2 } from "react-icons/lu";
import { useActiveWorkspace } from "@/hooks/use-active-ws";
import BoardModal from "@/components/modals/board-modal";
import Link from "next/link";
import WorkshopHeader from "../../_components/workshop-header";
import { WorkspacePageParams } from "@/schemas/workspace-schema";
import BillingModal from "@/components/modals/billing-modal";
import { useWSSubscription } from "@/hooks/use-ws-subscription";

const BillingWorkspace = ({ params }: WorkspacePageParams) => {
  const { data: boards, isLoading } = useCurrentBoards(params.workspaceId);
  const { setActiveWs } = useActiveWorkspace();
  const { data: currentWorkspace, isLoading: WsLoading } = useSpecificWorkspace(
    params.workspaceId
  );

  const { data: isSubsripted } = useWSSubscription(params?.workspaceId);

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

      {/** check if workspace is subscriped  */}
      {isSubsripted ? (
        <div className="p-3 flex items-center bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-white/80 rounded-lg max-w-3xl mx-auto text-center justify-center font-semibold">
          You are currently subscriped
        </div>
      ) : (
        <BillingModal workspaceId={params?.workspaceId} />
      )}
    </div>
  );
};

export default BillingWorkspace;

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
