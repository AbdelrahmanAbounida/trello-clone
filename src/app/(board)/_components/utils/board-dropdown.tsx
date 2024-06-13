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

const BoardDropdown = ({ board }: { board: Board }) => {
  const [openMenu, setopenMenu] = useState(false);
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
        <DropdownMenuItem className="items-center justify-between gap-3 py-2">
          Create New Board
        </DropdownMenuItem>
        <DropdownMenuItem className="items-center justify-between gap-3 py-2">
          Copy Board
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="items-center justify-between gap-3 py-2">
          Delete Board
          <FaTrash className=" w-4 h-4 " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BoardDropdown;
