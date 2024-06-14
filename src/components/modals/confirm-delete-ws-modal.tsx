"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useActiveWorkspace } from "@/hooks/use-active-ws";
import { deleteWorkspace } from "@/actions/workspace/delete-workspace";
import { Workspace } from "@prisma/client";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";

const ConfirmDeleteWSModal = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace;
}) => {
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const { activeWsId } = useActiveWorkspace();
  const [deleteLoading, setdeleteLoading] = useState(false);

  const handledeleteWorkspace = async () => {
    try {
      setdeleteLoading(true);
      const resp = await deleteWorkspace({
        workspaceId: currentWorkspace?.id!,
      });
      if (resp?.error) {
        toast.error(resp?.details);
      } else {
        router.push("/main");
      }
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    } finally {
      setdeleteLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"default"}
          className="bg-red-600 hover:bg-red-700 text-white text-md w-[210px]"
        >
          Delete Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className=" ">
        <DialogHeader className="justify-start flex  text-start ">
          <DialogTitle className="w-full flex text-start items-center justify-start text-zinc-800">
            Delete Workspace
          </DialogTitle>
          <DialogDescription className="text-start">
            Confirm delete workspace
          </DialogDescription>
        </DialogHeader>
        <div className="font-medium text-lg">
          Are you sure you want to delete this workspace ?
        </div>
        <DialogFooter className="sm:justify-start">
          {deleteLoading ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          ) : (
            <Button
              onClick={handledeleteWorkspace}
              variant={"default"}
              className="bg-red-600 hover:bg-red-700 text-white text-md w-[110px]"
            >
              Delete
            </Button>
          )}
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteWSModal;
