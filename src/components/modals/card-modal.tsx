"use client";
import React, { useEffect, useState } from "react";
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
  ReloadIcon,
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
import { copyTask } from "@/actions/task/create-task";
import { useRouter } from "next/navigation";
import { deleteTask } from "@/actions/task/delete-task";
import { Input } from "../ui/input";
import { renameTask, updateTaskDescription } from "@/actions/task/update-task";
import { Skeleton } from "../ui/skeleton";
import { Activity } from "@prisma/client";
import { getTaskActivities } from "@/actions/activity/get-activity";

const CardModal = () => {
  const { taskToBeShown, setTaskTobeShow } = useCurrentBoard();
  const [textaeraFocused, settextaeraFocused] = useState(false);
  const [focused, setfocused] = useState(false);
  const [currentDescription, setcurrentDescription] = useState(
    taskToBeShown?.description
  );
  const [newCardTitle, setnewCardTitle] = useState(taskToBeShown?.title);
  const [loading, setloading] = useState({
    copy: false,
    delete: false,
    task: true,
  });

  const [taskActivities, settaskActivities] = useState<Activity[]>([]);

  const router = useRouter();

  function isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  const handleCopyTask = async () => {
    try {
      setloading({ ...loading, copy: true });
      const resp = await copyTask({
        taskId: taskToBeShown?.id!,
      });
      if (resp?.error) {
        toast.error(resp?.details);
      }
      router.refresh();
      console.log({ resp });
    } catch (error) {
      console.log({ error });
      toast.error("something went wrong");
    } finally {
      setloading({ ...loading, copy: false });
    }
  };

  const handleDeleteTask = async () => {
    try {
      setloading({ ...loading, delete: true });
      const resp = await deleteTask({
        taskId: taskToBeShown?.id!,
        columnId: taskToBeShown?.columnId!,
      });
      if (resp?.error) {
        toast.error(resp?.details);
      }
      router.refresh();
      setTaskTobeShow(null);
      console.log({ resp });
    } catch (error) {
      console.log({ error });
      toast.error("something went wrong");
    } finally {
      setloading({ ...loading, delete: false });
    }
  };

  const handleupdateTaskTitle = async () => {
    if (newCardTitle == taskToBeShown?.title || !focused) {
      return;
    }

    try {
      const res = await renameTask({
        taskId: taskToBeShown?.id!,
        newtitle: newCardTitle!,
      });

      if (res?.error) {
        toast.error(res?.details);
      } else {
        toast.success("task renamed successfully");
        router.refresh();
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setfocused(false);
    }
  };
  const handleupdateTaskDescription = async () => {
    if (currentDescription == taskToBeShown?.description) {
      return;
    }
    try {
      const res = await updateTaskDescription({
        taskId: taskToBeShown?.id!,
        newDescription: currentDescription!,
      });

      if (res?.error) {
        toast.error(res?.details);
      } else {
        toast.success("task description updated successfully");
        router.refresh();
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const updateCurrentActivities = async () => {
    try {
      const resp = await getTaskActivities({
        taskId: taskToBeShown?.id!,
        columnId: taskToBeShown?.columnId,
      });
      if (resp?.error) {
        toast.error(resp.details);
      } else {
        settaskActivities(resp.details);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (taskToBeShown) {
      setloading({ ...loading, task: false });
      setcurrentDescription(taskToBeShown?.description!);
      setnewCardTitle(taskToBeShown?.title!);
    }
    updateCurrentActivities();
  }, [taskToBeShown]);

  return (
    <Dialog open={!!taskToBeShown} onOpenChange={() => setTaskTobeShow(null)}>
      <DialogContent className="sm:max-w-5xl bg-[#F3F2F5] p-7">
        {loading?.task ? (
          <DialogLoading />
        ) : (
          <>
            <DialogHeader className="flex w-full ">
              <div className="flex items-start gap-3 ">
                <StackIcon className="w-6 h-6" />
                <DialogTitle className="flex flex-col items-start gap-0">
                  {/* <span className="text-2xl text-zinc-700">
                {taskToBeShown?.title}
              </span> */}

                  <Input
                    onClick={() => setfocused(true)}
                    autoFocus={false}
                    className="border-0 shadow-none text-2xl text-zinc-700 font-semibold  w-full flex-1 p-0 pb-1 focus:border-2"
                    value={newCardTitle || taskToBeShown?.title}
                    onChange={(e) => setnewCardTitle(e.target.value)}
                    onBlur={handleupdateTaskTitle}
                  />

                  <DialogDescription className="font-medium">
                    in list{" "}
                    <span className="underline">
                      {taskToBeShown?.column.title}
                    </span>
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
                      value={currentDescription!}
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
                    {loading?.copy ? (
                      <Button
                        disabled
                        className="bg-gray-300 text-muted-foreground"
                      >
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Copying
                      </Button>
                    ) : (
                      <Button
                        onClick={handleCopyTask}
                        variant={"outline"}
                        className="flex items-center bg-[#E6E5E6] hover:bg-[#E6E5E6] hover:opacity-80 justify-start gap-3"
                      >
                        <CopyIcon className="w-5 h-5 text-sky-700" />
                        <span className="text-xl">Copy</span>
                      </Button>
                    )}
                    {/** 2- delete */}
                    {loading?.delete ? (
                      <Button
                        disabled
                        className="bg-gray-300 text-muted-foreground"
                      >
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Deleting
                      </Button>
                    ) : (
                      <Button
                        onClick={handleDeleteTask}
                        variant={"secondary"}
                        className="bg-[#E6E5E6] hover:bg-[#E6E5E6] hover:opacity-80 justify-start gap-3"
                      >
                        <TrashIcon
                          className="w-5 h-5 text-red-500"
                          fill="red"
                        />
                        <span className="text-xl">Delete</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className=" pl-9 mt-3">
                {textaeraFocused && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        handleupdateTaskDescription();
                        settextaeraFocused(false);
                      }}
                      size={"sm"}
                      variant={"default"}
                      className="bg-sky-600 hover:bg-sky-700 w-[100px]"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setcurrentDescription(taskToBeShown?.description!);
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

                {taskActivities?.map((activity, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-purple-800 text-white h-[50px] w-[50px] flex items-center justify-center font-semibold text-lg">
                        A
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            Abdelrahman Aboneda
                          </span>
                          <span className="text-gray-500">
                            updated card "rename card"
                          </span>
                        </div>
                        <div className="text-gray-500/80">
                          {/* {formatRelative(taskToBeShown?.createdAt!, new Date())} */}
                          {isValidDate(taskToBeShown?.createdAt!) &&
                            formatRelative(
                              taskToBeShown?.createdAt!,
                              new Date()
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;

const DialogLoading = () => (
  <div className="sm:max-w-5xl bg-[#F3F2F5] p-7">
    <div className="flex w-full ">
      <div className="flex items-start gap-3 ">
        <Skeleton className="w-6 h-6" />
        <div className="flex flex-col items-start gap-1">
          <Skeleton className="h-[30px] w-[250px]" />
          <Skeleton className="h-[15px] w-[90px]" />
        </div>
      </div>
    </div>

    {/** description actions */}
    <div className=" ">
      <div className="flex items-start justify-between gap-5 w-full mt-4">
        {/** description */}
        <div className="flex items-start gap-3 flex-1  ">
          <div className="flex flex-col gap-3 w-full flex-1 pt-5">
            <Skeleton className="w-[250px] h-[20px]" />
            <Skeleton className="w-full h-[200px]" />
          </div>
        </div>

        {/** actions */}
        <div className="flex flex-col gap-3 mt-6 w-[25%]">
          <Skeleton className="w-full h-[19px]" />

          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-[40px]" />
            <Skeleton className="w-full h-[40px]" />
          </div>
        </div>
      </div>
      <div className=" mt-9">
        <Skeleton className="w-[240px] h-[20px]" />
      </div>
    </div>

    {/** activities */}
    <div className="mt-5 flex flex-col gap-2">
      <Skeleton className="w-2/4 h-[20px]" />
      <Skeleton className="w-2/4 h-[20px]" />
    </div>
    {/** ::TODO:: */}
  </div>
);
