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
import {
  CopyIcon,
  Cross1Icon,
  Cross2Icon,
  DotsHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ColumnWithTasks } from "@/schemas/drag-schemas";
import { FaTrash } from "react-icons/fa";

const ColumnDropdown = ({ column }: { column: ColumnWithTasks }) => {
  const [openMenu, setopenMenu] = useState(false);
  return (
    <DropdownMenu open={openMenu} onOpenChange={setopenMenu}>
      <DropdownMenuTrigger className="focus:outline-none outline-none ring-0 border-0 focus:ring-0">
        <Button
          variant={"ghost"}
          className=" p-1 text-primary/50 mr-auto h-auto  relative "
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <DotsHorizontalIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="z-[1000] w-[250px]">
        <DropdownMenuLabel className="flex items-center justify-between p-0">
          <span className="pl-2">List Actionss</span>
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
          Add Card
          {/* <PlusIcon className=" w-4 h-4 text-accent-foreground " /> */}
        </DropdownMenuItem>
        <DropdownMenuItem className="items-center justify-between gap-3 py-2">
          Copy List
          {/* <CopyIcon className="w-4 h-4" /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="items-center justify-between gap-3 py-2">
          Delete List
          <FaTrash className=" w-4 h-4 " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnDropdown;
