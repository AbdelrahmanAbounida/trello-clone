import { Button } from "@/components/ui/button";
import React from "react";
import { BsPlus } from "react-icons/bs";

const CreateWorkSpaceButton = () => {
  return (
    <Button
      variant={"ghost"}
      className=" border-none md:border   mb-2 md:mb-5 text-md w-full flex items-center justify-between"
    >
      <div className="">Workspaces</div>
      <BsPlus />
    </Button>
  );
};

export default CreateWorkSpaceButton;
