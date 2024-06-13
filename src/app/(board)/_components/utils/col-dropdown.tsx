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
import { ColumnWithTasks } from "@/schemas/drag-schemas";
import { FaTrash } from "react-icons/fa";
import { useGlobalLoading } from "@/hooks/use-global-loading";
import { deleteColumn } from "@/actions/col/delete-col";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { copyColumn } from "@/actions/col/create-col";

const ColumnDropdown = ({ column }: { column: ColumnWithTasks }) => {
  const [openMenu, setopenMenu] = useState(false);
  const { setIsGlobalLoading } = useGlobalLoading();
  const router = useRouter();

  const handleDeleteColumn = async () => {
    try {
      // copy loading
      setIsGlobalLoading(true);
      const resp = await deleteColumn({ colId: column.id, withActivity: true });

      if (resp.error) {
        toast.error(resp?.details);
      } else {
        toast.success("Column deleted successfully");
        router.refresh();
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed deleting board");
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleCopyColumn = async () => {
    try {
      // copy loading
      setIsGlobalLoading(true);
      const resp = await copyColumn({ colId: column.id });

      if (resp.error) {
        toast.error(resp?.details);
      } else {
        toast.success("Column copied successfully");
        router.refresh();
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed copying board");
    } finally {
      setIsGlobalLoading(false);
    }
  };

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
        {/* <DropdownMenuItem className="items-center justify-between gap-3 py-2">
          Add Card
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={handleCopyColumn}
          className="items-center justify-between gap-3 py-2"
        >
          Copy List
          {/* <CopyIcon className="w-4 h-4" /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteColumn}
          className="items-center justify-between gap-3 py-2"
        >
          Delete List
          <FaTrash className=" w-4 h-4 " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnDropdown;
