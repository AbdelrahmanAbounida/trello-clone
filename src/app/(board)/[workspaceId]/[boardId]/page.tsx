import React from "react";
import { BoardContainer, KanbanBoard } from "../../_components/board";
import { getBoardbyId } from "@/actions/board/get-board";
import { redirect } from "next/navigation";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface BoardPageParams {
  boardId: string;
  workspaceId: string;
}

const BoardPage = async ({ params }: { params: BoardPageParams }) => {
  const currentBoard = await getBoardbyId({ boardId: params.boardId });

  if (!currentBoard) {
    return redirect("/main");
  }
  return (
    <div
      style={{ backgroundImage: `url(${currentBoard?.backgroundImage})` }}
      className="flex flex-col gap-9 w-full h-screen "
    >
      {/**navabr */}
      <div className="flex w-full relative h-[60px] p-3 items-center justify-between z-[100]">
        {/* Background Layer */}
        <div className="inset-0 absolute left-0 top-0 w-full h-full opacity-60 bg-[#6B6563]/90 z-[0]" />

        {/* Content Layer */}
        <div className="flex w-full justify-between items-center z-[10] relative">
          <h1 className="text-2xl font-bold z-100 text-white">
            {currentBoard.title}
          </h1>
          {/** ::TODO:: Add new dropdown for board settings */}
          <div className="cursor-pointer">
            <HiOutlineDotsHorizontal size={25} color="white" />
          </div>
        </div>
      </div>

      {/** board */}
      <div className="mt-3">
        <KanbanBoard boardColumns={currentBoard.columns} />
      </div>
    </div>
  );
};

export default BoardPage;
