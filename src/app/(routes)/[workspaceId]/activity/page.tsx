"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSpecificWorkspace } from "@/hooks/use-current-ws";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useActiveWorkspace } from "@/hooks/use-active-ws";
import WorkshopHeader from "../../_components/workshop-header";
import { WorkspacePageParams } from "@/schemas/workspace-schema";
import { useCurrentActivities } from "@/hooks/use-current-activities";
import { Activity } from "@prisma/client";
import ProfileImageAvatar from "../../_components/profile-img-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatRelative } from "date-fns";
import { isValidDate } from "@/lib/format";
import { ActivityLoading } from "@/components/modals/card-modal";

const OraganizationActivity = ({ params }: WorkspacePageParams) => {
  const {
    data: activities,
    isLoading,
  }: { data: Activity[]; isLoading: boolean } = useCurrentActivities(
    params.workspaceId
  );
  const user = useCurrentUser();

  const { setActiveWs } = useActiveWorkspace();
  const { data: currentWorkspace, isLoading: WsLoading } = useSpecificWorkspace(
    params.workspaceId
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
      {(WsLoading || isLoading) && <ActivitiesLoading />}
      {/** Empty state with no boards  */}
      {!isLoading && !WsLoading && (
        <div className="h-full w-full flex flex-col items-start p-2  rounded-md">
          {/** Navbar */}
          <WorkshopHeader currentWorkspace={currentWorkspace!} />

          {/** boards list */}
          <div className="flex flex-col my-4 mt-7 w-full">
            <div className="flex flex-wrap items-start gap-5 p-1 mt-1 w-full ">
              <div className="flex flex-col gap-5">
                {activities?.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4  ">
                    {/** avatar */}
                    <ProfileImageAvatar
                      profileProps={{
                        name: user?.name!,
                        email: user?.email!,
                        image: user?.image!,
                      }}
                    />
                    {/** main content */}
                    <div className="flex flex-col gap-1 ">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">
                          {user?.name || user?.email}
                        </span>
                        <span className="text-gray-500">
                          {activity?.content}
                        </span>
                      </div>
                      <div className="text-gray-500/80">
                        {isValidDate(activity?.createdAt!) &&
                          formatRelative(activity?.createdAt!, new Date())}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/** List of boards */}
    </div>
  );
};

export default OraganizationActivity;

const ActivitiesLoading = () => (
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

    {/** activiities */}
    <ActivityLoading />
  </div>
);
