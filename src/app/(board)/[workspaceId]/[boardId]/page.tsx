import React from "react";
import { KanbanBoard } from "../../_components/drag/board";
import { getBoardbyId } from "@/actions/board/get-board";
import { redirect } from "next/navigation";
import Link from "next/link";
import BoardDropdown from "../../_components/utils/board-dropdown";

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
      className="flex flex-col gap-9 w-full h-full bg-cover bg-center "
    >
      {/**navabr */}
      <div className="flex w-full relative h-[60px] p-3 items-center justify-between ">
        {/* Background Layer */}
        <div className="inset-0 absolute left-0 top-0 w-full h-full opacity-60 bg-[#6B6563]/90 z-[0]" />

        {/* Content Layer */}
        <div className="flex w-full justify-between items-center relative">
          <Link
            href={`/${params.workspaceId}/boards`}
            className="text-2xl font-bold  text-white"
          >
            {currentBoard.title}
          </Link>
          {/** ::TODO:: Add new dropdown for board settings */}
          <div className="cursor-pointer z-100 text-white">
            {/* <HiOutlineDotsHorizontal size={25} color="white" /> */}
            <BoardDropdown board={currentBoard} />
          </div>
        </div>
      </div>

      {/** board */}
      <div className="mt-3 overflow-auto h-full">
        <KanbanBoard
          boardColumns={currentBoard.columns}
          boardId={params.boardId}
        />
      </div>
    </div>
  );
};

export default BoardPage;
