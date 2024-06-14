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
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import {
  createBoardSchema,
  createBoardSchemaType,
} from "@/schemas/board-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewBoard } from "@/actions/board/create-board";
import toast from "react-hot-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { uploadBoardImage } from "@/lib/s3";
import { useRouter } from "next/navigation";
import { useActiveWorkspace } from "@/hooks/use-active-ws";
import { useTheme } from "next-themes";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const handleUploadImage = async (file: File, boardId: string) => {
  try {
    // const url = URL.createObjectURL(file);

    // get signed url
    const checksum = await computeSHA256(file);
    const signedURLResult = await uploadBoardImage({ boardId, checksum });

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
      // toast.success("File uploaded successfully");
    } else {
      toast.error("Something went wrong");
      return;
    }
  } catch (error) {
    console.log({ error });
    toast.error("Something went wrong");
  }
};

const BoardModal = ({ children }: { children?: React.ReactNode }) => {
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const { activeWsId } = useActiveWorkspace();
  const { theme } = useTheme();

  // form
  const form = useForm<createBoardSchemaType>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      // imageFile: null,
      isPublic: false,
      title: "",
    },
  });
  const errors = form?.formState.errors;
  // submit
  const createBoard = async (data: createBoardSchemaType) => {
    try {
      setloading(true);
      console.log(data);

      // 1- create Board
      const res = await createNewBoard({
        isPublic: data.isPublic,
        title: data.title,
        workspaceId: activeWsId,
      });

      // 2- upload logo to s3
      if (!res?.error) {
        const newBoard = res.details;
        // 2- update its image in s3
        const imageUrl = await handleUploadImage(data.imageFile, newBoard.id);

        toast.success("Board has been created successfully");
        router.push(`/${newBoard?.workspaceId}/${newBoard?.id}`);
      } else {
        // 3- handling errors
        toast.error(res?.details!);
      }
      setloading(false);
    } catch (error) {
      console.log({ error });
    } finally {
      setloading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={() => {
        form.clearErrors();
        // form.reset();
      }}
    >
      {" "}
      {/** setsubmitError({ title: false, file: false }) */}
      <DialogTrigger>
        {children ? (
          children
        ) : (
          <Button
            variant={"default"}
            className="bg-sky-700 hover:bg-sky-600 text-white text-md w-[110px]"
          >
            Create
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className=" ">
        <DialogHeader>
          <DialogTitle
            className={`w-full flex text-center items-center justify-center ${
              theme == "dark" ? "text-zinc-100" : "text-zinc-800"
            }`}
          >
            Create Board
          </DialogTitle>
          <DialogDescription className="text-center">
            Create new board under asd Workspace
          </DialogDescription>
        </DialogHeader>

        {/** Form */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createBoard)}
            className="w-full space-y-7"
          >
            {/** 1-board title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-start   ">
                  <FormLabel
                    htmlFor="name"
                    className="text-left font-semibold  pl-1 text-black"
                  >
                    Board Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Your board title"
                      {...field}
                      // className={cn(errors.title && "border-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** 2- Board background image */}
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="flex flex-col items-start justify-start ">
                  <FormLabel
                    htmlFor="name"
                    className="text-left font-semibold pl-1 text-black"
                  >
                    Board Background Image
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
                      // className={cn(errors.imageFile && "border-red-500")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** 3- is public */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="font-semibold">Is public</FormLabel>
                    <FormDescription>
                      select if you prefer to make this workspace public
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="flex items-center justify-center  text-center">
              {loading ? (
                <Button
                  disabled
                  className="w-full bg-gray-300 text-muted-foreground"
                >
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating new board
                </Button>
              ) : (
                <Button
                  className="align-center w-full dark:text-white text-center bg-sky-700 hover:bg-sky-600 font-semibold text-md"
                  // onClick={createBoard}
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

export default BoardModal;
