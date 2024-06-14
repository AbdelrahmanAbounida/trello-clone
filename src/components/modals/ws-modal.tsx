"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWorkspaceModal } from "@/hooks/modals/use-ws-modal";
import { useForm } from "react-hook-form";
import {
  createWorkspaceSchema,
  createWorkspaceSchemaType,
} from "@/schemas/workspace-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { uploadWorkpaceLogo } from "@/lib/s3";
import { createNewWorkSpace } from "@/actions/workspace/create-workspace";
import { useRouter } from "next/navigation";
import { getWorkSpacebyName } from "@/actions/workspace/get-workspace";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const handleUploadLogo = async (file: File, workspaceId: string) => {
  console.log("Uploading new ws logo");
  try {
    // const url = URL.createObjectURL(file);
    // console.log({url});

    // get signed url
    const checksum = await computeSHA256(file);

    const signedURLResult = await uploadWorkpaceLogo({ workspaceId, checksum });
    console.log({ signedURLResult });

    if (signedURLResult?.error) {
      toast.error(signedURLResult.error);
      return;
    }

    if (signedURLResult?.url) {
      console.log(signedURLResult?.url);
      // get image
      await fetch(signedURLResult?.url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
    } else {
      console.log({ signedURLResult });
      toast.error("Something went wrong");
      return;
    }
  } catch (error) {
    console.log({ error });
    toast.error("Something went wrong");
  }
};

const WorkspaceModal = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: React.HTMLAttributes<HTMLElement>["className"];
}) => {
  const { isOpen, onClose } = useWorkspaceModal();
  const [loading, setloading] = useState(false);
  const user = useCurrentUser();
  const router = useRouter();

  // form
  const form = useForm<createWorkspaceSchemaType>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      logo: undefined,
      name: "",
    },
  });

  // submit

  // const testS3 = async (data: createWorkspaceSchemaType) => {
  //   try {
  //     const newWs = await getWorkSpacebyName({ name: "Gedanken Inc" });
  //     const imageUrl = await handleUploadLogo(data?.logo!, newWs?.id!);
  //     console.log({ imageUrl });
  //   } catch (error) {
  //     console.log({ error });
  //   }
  //   // toast.success("logo uploaded successfully");
  // };
  const createWorkspace = async (data: createWorkspaceSchemaType) => {
    try {
      setloading(true);
      // 1- create ws

      const res = await createNewWorkSpace({
        name: data.name,
        userId: user?.id!, //
      });
      // 2- handling errors

      const error = res?.error;
      if (error) {
        const errorMessage = res?.details;
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error("Something went wrong while creating new Workspace");
        }
      }
      // 3- upload workspace logo if exist
      else {
        const newWs = res?.details;
        if (data?.logo) {
          const imageUrl = await handleUploadLogo(data.logo, newWs?.id!);
        }
        setloading(false);
        onClose();
        toast.success("Workspace has been created successfully");
        router.refresh();
      }
      setloading(false);
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong");
    } finally {
      setloading(false);
      router.refresh();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        form.clearErrors();
      }}
    >
      {/** setsubmitError({ title: false, file: false }) */}
      {/* <DialogTrigger className={cn(className)}>
        {children ? (
          children
        ) : (
          <Button
            type="submit"
            variant={"secondary"}
            className="bg-sky-700 hover:bg-sky-600 text-white  transition-transform transform scale-100 active:scale-[0.97]"
          >
            Create Workspace
          </Button>
        )}
      </DialogTrigger> */}

      <DialogContent onClose={onClose} className=" ">
        <DialogHeader>
          <DialogTitle className="w-full flex text-center items-center justify-center dark:text-white text-zinc-800">
            Create Workspace
          </DialogTitle>
          <DialogDescription className="text-center">
            Create new Workspace to add more boards
          </DialogDescription>
        </DialogHeader>

        {/** Form */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createWorkspace)}
            className="w-full space-y-7"
          >
            {/** 1-Workspace title */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-start   ">
                  <FormLabel
                    htmlFor="name"
                    className="text-left font-semibold  pl-1 text-black"
                  >
                    Workspace Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Your Workspace name"
                      {...field}
                      // className={cn(errors.title && "border-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** 2- Workspace Logo */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="flex flex-col items-start justify-start ">
                  <FormLabel
                    htmlFor="name"
                    className="text-left font-semibold pl-1 text-black"
                  >
                    Workspace Logo (optional)
                  </FormLabel>

                  <FormControl>
                    <Input
                      // value={value}
                      id="picture"
                      type="file"
                      accept="image/*"
                      {...fieldProps}
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                      // className={cn(errors.logo && "border-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex items-center justify-center  text-center">
              {loading ? (
                <Button
                  disabled
                  className="w-full bg-gray-300 text-accent-foreground"
                >
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating New Workspace
                </Button>
              ) : (
                <Button
                  className="align-center w-full text-center bg-sky-700 hover:bg-sky-600 font-semibold text-md dark:text-white"
                  type="submit"
                >
                  Create
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceModal;
