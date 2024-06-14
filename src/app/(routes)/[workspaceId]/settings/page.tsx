"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpecificWorkspace } from "@/hooks/use-current-ws";
import React, { useEffect, useState } from "react";
import { useCurrentBoards } from "@/hooks/use-current-boards";
import { redirect, useRouter } from "next/navigation";
import { LuUser2 } from "react-icons/lu";
import { useActiveWorkspace } from "@/hooks/use-active-ws";
import BoardModal from "@/components/modals/board-modal";
import Link from "next/link";
import WorkshopHeader from "../../_components/workshop-header";
import { WorkspacePageParams } from "@/schemas/workspace-schema";
import { GearIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { renameWorkspace } from "@/actions/workspace/update-workspace";
import { toast } from "sonner";
import { BsTrash } from "react-icons/bs";
import { deleteWorkspace } from "@/actions/workspace/delete-workspace";
import ConfirmDeleteWSModal from "@/components/modals/confirm-delete-ws-modal";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
});

const WorkspaceSettings = ({ params }: WorkspacePageParams) => {
  const { data: boards, isLoading } = useCurrentBoards(params.workspaceId);
  const { setActiveWs } = useActiveWorkspace();
  const [renameLoading, setrenameLoading] = useState(false);

  const { data: currentWorkspace, isLoading: WsLoading } = useSpecificWorkspace(
    params.workspaceId
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentWorkspace?.name,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.name == currentWorkspace?.name) {
      return;
    }
    try {
      setrenameLoading(true);
      const resp = await renameWorkspace({
        workspaceId: currentWorkspace?.id!,
        newName: values.name,
      });
      if (resp?.error) {
        toast.error(resp?.details);
      } else {
        toast.success("Workspace renmaed successfully");
      }
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    } finally {
      setrenameLoading(false);
    }
  }

  const cancel = () => {
    router.refresh();
  };

  useEffect(() => {
    if (!WsLoading && !currentWorkspace) {
      redirect("/main");
    }
    setActiveWs(params.workspaceId);
  }, [WsLoading]);

  return (
    <div className="h-full w-full ">
      {/** Loading State  */}
      {(WsLoading || isLoading) && <WorkSpacesLoading />}
      {/** Empty state with no boards  */}
      {!isLoading && !WsLoading && (
        <div className="h-full w-full flex flex-col items-start p-2  rounded-md">
          {/** Navbar */}
          <WorkshopHeader currentWorkspace={currentWorkspace!} />

          {/** boards list */}
          <div className="flex flex-col my-4 mt-7 w-full">
            <div className="flex items-center gap-1">
              <GearIcon className="" width={35} />
              <p className="text-xl font-medium">Workspace Settings</p>
            </div>

            <div className="flex flex-wrap items-start gap-5 p-1 mt-5 w-full ">
              {/** settings form  */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8  w-full"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    defaultValue={currentWorkspace?.name}
                    render={({ field }) => (
                      <FormItem className=" w-3/4">
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl>
                          <Input placeholder="name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your workspace name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    {renameLoading ? (
                      <Button disabled>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Loading
                      </Button>
                    ) : (
                      <Button
                        className="bg-sky-700 hover:bg-sky-600 w-[110px]"
                        type="submit"
                      >
                        Save
                      </Button>
                    )}
                    <Button
                      onClick={cancel}
                      variant={"secondary"}
                      type="submit"
                    >
                      cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/** workspace Deleting */}
            <div className="flex items-center gap-4 mt-9">
              <BsTrash className="" width={35} />
              <p className="text-xl font-medium">Delete Workspace</p>
            </div>

            <div className="mt-3">
              <ConfirmDeleteWSModal currentWorkspace={currentWorkspace!} />
            </div>
          </div>
        </div>
      )}

      {/** List of boards */}
    </div>
  );
};

export default WorkspaceSettings;

const WorkSpacesLoading = () => (
  <div className="flex flex-col gap-3">
    {/** first line  */}
    <div className="flex items-center justify-start gap-2">
      <Skeleton className="w-[50px] h-[50px] rounded-md" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-[130px] h-[15px]" />
        <Skeleton className="w-[90px] h-[10px]" />
      </div>
    </div>
    {/** sep */}
    <Skeleton className="w-full h-[3px]" />

    {/** boards */}
    <div className="flex items-center gap-2">
      <Skeleton className="w-[150px] h-[20px]" />
    </div>
    <div className="flex w-full items-center gap-3 mt-2 flex-wrap">
      {[1, 2, 3, 4, 5].map((item, inedx) => (
        <Skeleton key={inedx} className="w-[220px]  h-[130px]" />
      ))}
    </div>
  </div>
);
