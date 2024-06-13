"use client";
import React, { useState } from "react";
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
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { GoPulse } from "react-icons/go";
import { format, formatDate, formatRelative, getYear, subDays } from "date-fns";

const CardModal = () => {
  const { taskToBeShown, setTaskTobeShow } = useCurrentBoard();
  const [textaeraFocused, settextaeraFocused] = useState(false);
  const [currentDescription, setcurrentDescription] = useState("");

  function isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

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
        <div className=" ">
          <div className="flex items-start justify-between gap-5 w-full mt-4">
            {/** description */}
            <div className="flex items-start gap-3 flex-1  ">
              <TextAlignLeftIcon className="h-7 w-7 mt-5" />
              <div className="flex flex-col gap-3 w-full flex-1 pt-5">
                <h1 className="text-xl text-gray-800 font-semibold">
                  Description
                </h1>

                <Textarea
                  // onBlur={() => settextaeraFocused(false)}
                  value={currentDescription}
                  onChange={(e) => setcurrentDescription(e.target.value)}
                  onFocus={() => settextaeraFocused(true)}
                  rows={6}
                  className={cn(
                    "resize-none focus:outline-none focus:ring-0 ring-0 outline-none border-none",
                    !textaeraFocused ? "bg-[#E6E5E6]" : "bg-white"
                  )}
                  placeholder="Add a more detailed description"
                />
              </div>
            </div>

            {/** actions */}
            <div className="flex flex-col gap-3 mt-5 w-[25%]">
              <h2 className="text-lg font-semibold pl-1 text-gray-800">
                Actions
              </h2>

              <div className="flex flex-col gap-4">
                {/** 1- copy */}
                <Button
                  variant={"outline"}
                  className="flex items-center bg-[#E6E5E6] hover:bg-[#E6E5E6] hover:opacity-80 justify-start gap-3"
                >
                  <CopyIcon className="w-5 h-5 text-sky-700" />
                  <span className="text-xl">Copy</span>
                </Button>
                {/** 2- delete */}
                <Button
                  variant={"secondary"}
                  className="bg-[#E6E5E6] hover:bg-[#E6E5E6] hover:opacity-80 justify-start gap-3"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" fill="red" />
                  <span className="text-xl">Delete</span>
                </Button>
              </div>
            </div>
          </div>
          <div className=" pl-9 mt-3">
            {textaeraFocused && (
              <div className="flex items-center gap-2">
                <Button
                  size={"sm"}
                  variant={"default"}
                  className="bg-sky-600 hover:bg-sky-700 w-[100px]"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setcurrentDescription("");
                    settextaeraFocused(false);
                  }}
                  size={"sm"}
                  variant={"outline"}
                  className="bg-gray-200 hover:bg-gray-200/90 w-[90px]"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/** activities */}
        <div className="mt-2 ">
          <h1 className="flex items-center gap-4 text-xl font-bold">
            <GoPulse />
            Activity
          </h1>

          <div className="p-2 pl-9">
            {/** loop over activities */}

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-800 text-white h-[50px] w-[50px] flex items-center justify-center font-semibold text-lg">
                  A
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Abdelrahman Aboneda</span>
                    <span className="text-gray-500">
                      updated card "rename card"
                    </span>
                  </div>
                  <div className="text-gray-500/80">
                    {/* {formatRelative(taskToBeShown?.createdAt!, new Date())} */}
                    {isValidDate(taskToBeShown?.createdAt!) &&
                      formatRelative(taskToBeShown?.createdAt!, new Date())}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/** ::TODO:: */}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
