"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentBoard } from "@/hooks/drag-board/use-current-board";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  CopyIcon,
  Cross2Icon,
  GridIcon,
  HamburgerMenuIcon,
  StackIcon,
  TextAlignLeftIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const CardModal = () => {
  const { taskToBeShown, setTaskTobeShow } = useCurrentBoard();

  return (
    <Dialog open={!!taskToBeShown} onOpenChange={() => setTaskTobeShow(null)}>
      {/* <DialogTrigger>
        {children}
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-5xl bg-[#F3F2F5] p-7">
        <DialogHeader className="flex w-full ">
          <div className="flex items-start gap-3 ">
            <StackIcon className="w-6 h-6" />
            <DialogTitle className="flex flex-col items-start gap-0">
              <span className="text-2xl text-zinc-700">
                {taskToBeShown?.title}
              </span>
              <DialogDescription className="font-medium">
                in list{" "}
                <span className="underline">{taskToBeShown?.column.title}</span>
              </DialogDescription>
            </DialogTitle>
          </div>
        </DialogHeader>

        {/** description actions */}
        <div className="mt-3 ">
          <div className="flex items-center justify-between gap-5 w-full ">
            {/** description */}
            <div className="flex items-start gap-3 flex-1 ">
              <TextAlignLeftIcon className="h-7 w-7 mt-5" />
              <div className="flex flex-col gap-3 w-full flex-1 pt-5">
                <h1 className="text-xl text-gray-800 font-semibold">
                  Description
                </h1>
                <Textarea
                  rows={4}
                  className="bg-[#E6E5E6]"
                  placeholder="Add a more detailed description"
                />
              </div>
            </div>

            {/** actions */}
            <div className="flex flex-col gap-3 mt-3 w-[25%]">
              <h2 className="text-lg font-semibold pl-1 text-gray-800">
                Actions
              </h2>

              <div className="flex flex-col gap-4">
                {/** 1- copy */}
                <Button
                  variant={"outline"}
                  className="flex items-center bg-[#E6E5E6]"
                >
                  <CopyIcon className="w-4 h-4" />
                  <span className="text-xl">Copy</span>
                </Button>
                {/** 2- delete */}
                <Button variant={"secondary"} className="bg-[#E6E5E6]">
                  <TrashIcon className="w-4 h-4" />
                  <span className="text-xl">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/** activities */}
        {/** ::TODO:: */}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
