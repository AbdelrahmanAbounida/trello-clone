"use server";
import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";

export const createNewcolumn = async ({
  title,
  position,
  boardId,
}: {
  title: string;
  position: number;
  boardId: string;
}): Promise<ActionResponse> => {
  try {
    const col = await prismadb.column.create({
      data: {
        title,
        boardId,
        position,
      },
      select: {
        board: true,
      },
    });

    // create activity
    await createActivity({
      workspaceId: col.board.workspaceId,
      content: `created list "${title}"`,
    });

    return {
      error: false,
      details: col,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      details: "Something went wrong",
    };
  }
};
