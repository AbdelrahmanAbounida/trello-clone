"use client";
import WorkspaceModal from "@/components/modals/ws-modal";
import { Button } from "@/components/ui/button";
import { useWorkspaceModal } from "@/hooks/modals/use-ws-modal";
import React from "react";
import { BsPlus } from "react-icons/bs";

const CreateWorkSpaceButton = () => {
  const { onOpen } = useWorkspaceModal();

  return (
    <Button
      onClick={onOpen}
      variant={"ghost"}
      className=" md:border  mb-2 md:mb-5 text-md w-full flex items-center justify-between"
    >
      <div className="">Workspaces</div>
      <BsPlus />
    </Button>
  );
};

export default CreateWorkSpaceButton;
