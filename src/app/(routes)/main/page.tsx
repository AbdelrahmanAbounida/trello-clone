import { Button } from "@/components/ui/button";
import React from "react";

const OrganizationBoards = () => {
  const boards = [];
  return (
    <div className="h-full w-full ">
      {/** Empty state with no organization  */}
      {boards.length == 0 && (
        <div className="h-full w-full flex items-center justify-center border rounded-md">
          <div className="flex max-w-lg mx-auto flex-col space-y-3 items-center justify-center">
            <div className="flex flex-col space-y-2 items-center justify-center text-center">
              <h1 className="text-xl font-bold">You have no Boards</h1>
              <h3 className="text-gray-500 text-sm">
                You can start Creating boards as soon as you create a workspace.
              </h3>
            </div>

            <Button>Create Workspace</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationBoards;
