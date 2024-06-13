"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";

export const renameBoard = async ({
  boardId,
  newtitle,
}: {
  boardId: string;
  newtitle: string;
}): Promise<ActionResponse> => {
  try {
    const updatedBoard = await prismadb.board.update({
      where: {
        id: boardId,
      },
      data: {
        title: newtitle,
      },
    });
    // create new act
    await createActivity({
      workspaceId: updatedBoard.workspaceId,
      content: `updated board "${updatedBoard.title}"`,
    });
    return { error: false, details: updatedBoard };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
