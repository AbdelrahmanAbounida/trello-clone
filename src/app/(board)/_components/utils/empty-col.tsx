"use client";
import { createNewcolumn } from "@/actions/col/create-col";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { toast as sonnerToast } from "sonner";

const EmptyColumn = ({
  newPos,
  boardId,
}: {
  newPos: number;
  boardId: string;
}) => {
  const [showAddList, setshowAddList] = useState(false);
  const [newListName, setnewListName] = useState("");
  const [createLoading, setcreateLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const createList = async () => {
    try {
      if (!newListName) {
        return;
      }
      setcreateLoading(true);
      const resp = await createNewcolumn({
        title: newListName,
        boardId,
        position: newPos,
      });
      sonnerToast.success(`${newListName} List added successfully`);
      setshowAddList(false);
      router.refresh();
    } catch (error) {
      console.log({ error });
      sonnerToast.error("Something went wrong");
    } finally {
      setcreateLoading(false);
    }
  };

  useEffect(() => {
    if (showAddList && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddList]);
  return (
    <div className="flex h-full  items-start">
      <div className=" w-[350px]  bg-muted gap-1 p-3 rounded-lg justify-center items-start ">
        {showAddList ? (
          <div className="  p-2 flex flex-col gap-3 ">
            <Input
              ref={inputRef}
              value={newListName}
              disabled={createLoading}
              onChange={(e) => setnewListName(e.target.value)}
              className="focus:border-gray-400 "
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
                  onClick={createList}
                  variant={"default"}
                  className="bg-sky-600 w-[130px] hover:bg-sky-700"
                >
                  Add list
                </Button>
              )}
              <Button
                onClick={() => setshowAddList(false)}
                variant={"secondary"}
                className="w-[100px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setshowAddList(true)}
            className="cursor-pointer hover:opacity-90 opacity-100 font-medium text-lg h-[60px] max-h-[60px]  max-w-full bg-muted flex  flex-shrink-0 snap-center rounded-md items-center justify-start gap-2 p-4"
          >
            <PlusIcon className="w-6 h-6" />
            Add a list
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyColumn;
