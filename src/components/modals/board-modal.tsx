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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoardModal } from "@/hooks/use-board-modal";
import { cn } from "@/lib/utils";

const BoardModal = () => {
  const { isOpen, onOpen, onClose } = useBoardModal();

  // form fields
  const [boardTitle, setboardTitle] = useState("");
  const [submitError, setsubmitError] = useState({ title: false, file: false });

  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [selectedFileName, setselectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsubmitError((prev) => ({ ...prev, file: false }));
    const fileName = e.target.value;
    setselectedFileName(fileName);

    const file = e.target.files && e.target.files[0];
    if (file) {
      setselectedFile(file);
    }
  };
  const createBoard = async () => {
    if (!boardTitle && !selectedFile) {
      setsubmitError((prev) => ({ file: true, title: true }));
      return;
    } else if (!selectedFile) {
      setsubmitError((prev) => ({ ...prev, file: true }));
      return;
    } else if (!boardTitle) {
      setsubmitError((prev) => ({ ...prev, title: true }));
      return;
    } else {
      console.log({ boardTitle, selectedFile });
      // ::TODO::
      // upload file to S3
    }
  };
  return (
    <Dialog onOpenChange={() => setsubmitError({ title: false, file: false })}>
      <DialogTrigger>
        <Button
          variant={"default"}
          className="bg-sky-700 hover:bg-sky-600 text-white text-md w-[110px]"
        >
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className=" ">
        <DialogHeader>
          <DialogTitle className="w-full flex text-center items-center justify-center text-zinc-800">
            Create Board
          </DialogTitle>
          <DialogDescription className="text-center">
            Create new board under asd organization
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-3 items-start justify-start mb-4">
          <Label htmlFor="name" className="text-left font-semibold ">
            Board Title
          </Label>
          <Input
            id="name"
            value={boardTitle}
            onChange={(e) => {
              setsubmitError((prev) => ({ ...prev, title: false }));
              setboardTitle(e.target.value);
            }}
            className={cn(submitError.title && "border-red-500")}
          />
        </div>

        <div className="flex flex-col space-y-3 items-start justify-start my-1">
          <Label htmlFor="name" className="text-left font-semibold ">
            Board Background
          </Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            value={selectedFileName!}
            onChange={handleFileChange}
            className={cn(submitError.file && "border-red-500")}
          />
        </div>
        <DialogFooter className="flex items-center justify-center  text-center">
          <Button
            className="align-center w-full text-center bg-sky-700 hover:bg-sky-600 font-semibold text-md"
            onClick={createBoard}
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BoardModal;
