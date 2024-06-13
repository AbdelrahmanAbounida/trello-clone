"use client";
import { createnewTask } from "@/actions/task/create-task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Cross2Icon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";

const EmptyTask = ({
  newPos,
  columnId,
}: {
  newPos: number;
  columnId: string;
}) => {
  const [showAddTask, setshowAddTask] = useState(false);
  const [newTaskName, setnewTaskName] = useState("");
  const [createLoading, setcreateLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const createTaskCard = async () => {
    try {
      if (!newTaskName) {
        return;
      }
      setcreateLoading(true);
      const resp = await createnewTask({
        taskTitle: newTaskName,
        columnId,
        taskPos: newPos,
      });
      if (resp?.error) {
        sonnerToast.error(`${resp.details} `);
        return;
      }

      sonnerToast.success(`${newTaskName} Card added successfully`);
      setshowAddTask(false);
      router.refresh();
    } catch (error) {
      console.log({ error });
      sonnerToast.error("Something went wrong");
    } finally {
      setcreateLoading(false);
    }
  };

  useEffect(() => {
    if (showAddTask && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddTask]);

  return (
    <div
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
      className=""
    >
      {showAddTask ? (
        <div className="  p-2 flex flex-col gap-3 ">
          <Textarea
            value={newTaskName}
            disabled={createLoading}
            onChange={(e) => setnewTaskName(e.target.value)}
            className="focus:border-gray-400 bg-white  items-start w-full h-[100px]  text-wrap overflow-clip justify-start flex border "
            placeholder="Enter list title..."
          />

          <div className="flex mt-1 items-center gap-3">
            {createLoading ? (
              <Button disabled className="bg-gray-400">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={createTaskCard}
                variant={"default"}
                className="bg-sky-600 w-[130px] hover:bg-sky-700"
              >
                Add list
              </Button>
            )}
            <Button
              onClick={() => {
                console.log("test");
                setshowAddTask(false);
              }}
              variant={"ghost"}
              size={"icon"}
              className=" "
            >
              <Cross2Icon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setshowAddTask(true)}
          className="text-gray-500 text-md font-semibold flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-200 rounded-lg p-2"
        >
          <PlusIcon className="w-5 h-5 text-gray-500" />
          <span>Add a card</span>
        </div>
      )}
    </div>
  );
};

export default EmptyTask;
