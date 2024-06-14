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
import { Board } from "@prisma/client";
import BoardModal from "@/components/modals/board-modal";
import toast from "react-hot-toast";
import { useGlobalLoading } from "@/hooks/use-global-loading";
import { copyBoard } from "@/actions/board/create-board";
import { useRouter } from "next/navigation";
import { deleteBoard } from "@/actions/board/delete-board";

const BoardDropdown = ({ board }: { board: Board }) => {
  const [openMenu, setopenMenu] = useState(false);
  const { setIsGlobalLoading, isGlobalLoading } = useGlobalLoading();
  const router = useRouter();

  const handleCopyingBoard = async () => {
    try {
      // copy loading
      setIsGlobalLoading(true);
      const resp = await copyBoard({ boardId: board.id });

      if (resp.error) {
        toast.error(resp?.details);
      } else {
        router.push(`/${board.workspaceId}/boards`);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed copying board");
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      // copy loading
      setIsGlobalLoading(true);
      const resp = await deleteBoard({ boardId: board.id });

      if (resp.error) {
        toast.error(resp?.details);
      } else {
        router.push(`/${board.workspaceId}/boards`);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed deleting board");
    } finally {
      setIsGlobalLoading(false);
    }
  };

  return (
    <DropdownMenu open={openMenu} onOpenChange={setopenMenu}>
      <DropdownMenuTrigger className="focus:outline-none outline-none ring-0 border-0 focus:ring-0">
        <Button
          variant={"ghost"}
          className=" p-1 text-white mr-auto h-auto  relative "
        >
          <span className="sr-only">{`Move column: ${board.title}`}</span>
          <DotsHorizontalIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="z-[1000] w-[250px]">
        <DropdownMenuLabel className="flex items-center justify-between p-0">
          <span className="pl-2">Board Actionss</span>
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
        {/* <DropdownMenuItem className="items-center justify-between gap-3 py-2"> */}
        <div
          //   onClick={() => setopenMenu(false)}
          className="hover:bg-gray-100 dark:hover:bg-zinc-900 w-full py-[0.39rem] "
        >
          <BoardModal>
            <span className=" relative flex cursor-default select-none items-center rounded-sm px-2  text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              Create New Board
            </span>
          </BoardModal>
        </div>
        {/* </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={handleCopyingBoard}
          className="items-center justify-between gap-3 py-2"
        >
          Copy Board
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteBoard}
          className="items-center justify-between gap-3 py-2"
        >
          Delete Board
          <FaTrash className=" w-4 h-4 " fill="red" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BoardDropdown;
