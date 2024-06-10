"use server";

import { prismadb } from "@/lib/db";

export const getAllBoards = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const boards = await prismadb.board.findMany({
      where: {
        workspaceId,
      },
    });
    return boards;
  } catch (error) {
    console.log({ error });
    return [];
  }
};

export const getBoardbyId = async ({ boardId }: { boardId: string }) => {
  try {
    const board = await prismadb.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });
    return board;
  } catch (error) {
    console.log({ error });
    return;
  }
};
