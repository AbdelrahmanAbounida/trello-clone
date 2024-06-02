import { Button } from "@/components/ui/button";
import React from "react";

const CreateBoardButton = () => {
  return (
    <Button
      variant={"default"}
      className="bg-sky-700 hover:bg-sky-600 text-white text-md w-[110px]"
    >
      Create
    </Button>
  );
};

export default CreateBoardButton;
