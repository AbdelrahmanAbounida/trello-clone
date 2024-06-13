"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cross2Icon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { Task } from "@prisma/client";
import toast from "react-hot-toast";
import { deleteTask } from "@/actions/task/delete-task";
import { useCurrentBoard } from "@/hooks/drag-board/use-current-board";
import { useRouter } from "next/navigation";

const TaskDropdown = ({ task }: { task: Task }) => {
  const [openMenu, setopenMenu] = useState(false);
  const router = useRouter();

  const handleDeleteTask = async () => {
    try {
      const resp = await deleteTask({
        taskId: task.id,
        columnId: task.columnId,
      });
      if (resp?.error) {
        toast.error(resp?.details);
      }
      router.refresh();
      console.log({ resp });
    } catch (error) {
      console.log({ error });
      toast.error("something went wrong");
    }
  };
  return (
    <DropdownMenu open={openMenu} onOpenChange={setopenMenu}>
      <DropdownMenuTrigger className="focus:outline-none outline-none ring-0 border-0 focus:ring-0">
        <Button
          variant={"ghost"}
          className=" p-1 text-primary/50 mr-auto h-auto  relative"
        >
          <span className="sr-only">{`Move column: ${task.title}`}</span>
          <DotsHorizontalIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="z-[1000] w-[250px]">
        <DropdownMenuLabel className="flex items-center justify-between p-0">
          <span className="pl-2">Task Actionss</span>
          <Button
            onClick={() => {
              console.log("ads");
              setopenMenu(false);
            }}
            variant={"ghost"}
            size="icon"
            className="z-[10000] "
          >
            <Cross2Icon className="w-4 h-4 text-gray-600 cursor-pointer" />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="items-center justify-between gap-3 py-2">
          open Card
          {/* <PlusIcon className=" w-4 h-4 text-accent-foreground " /> */}
        </DropdownMenuItem>
        <DropdownMenuItem className="items-center justify-between gap-3 py-2">
          Copy Card
          {/* <CopyIcon className="w-4 h-4" /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteTask}
          className="items-center justify-between gap-3 py-2"
        >
          Delete Card
          <FaTrash className=" w-4 h-4 " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskDropdown;
