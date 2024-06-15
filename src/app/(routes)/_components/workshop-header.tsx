"use client";
import { Separator } from "@/components/ui/separator";
import { useWSSubscription } from "@/hooks/use-ws-subscription";
import { Workspace } from "@prisma/client";
import React from "react";
import { GoOrganization } from "react-icons/go";

const WorkshopHeader = ({
  currentWorkspace,
}: {
  currentWorkspace?: Workspace;
}) => {
  const { data: isSubscribed, isLoading: subLoading } = useWSSubscription(
    currentWorkspace?.id!
  );

  return (
    <div>
      <div className="flex items-center justify-start gap-4 p-1">
        {/** Logo */}
        {currentWorkspace?.logo ? (
          <img
            src={currentWorkspace?.logo}
            className="w-[50px] h-[50px] text-sky-700"
          />
        ) : (
          <GoOrganization size={70} className="text-sky-700" />
        )}
        {/** name */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">{currentWorkspace?.name}</h1>
          {/** ::TODO:: add workspace status  */}
          <p className="text-muted-foreground text-md">
            {!subLoading && (isSubscribed ? "Pro" : "Free")}
          </p>
        </div>
      </div>
      <Separator className="w-full mt-3" />
    </div>
  );
};

export default WorkshopHeader;
