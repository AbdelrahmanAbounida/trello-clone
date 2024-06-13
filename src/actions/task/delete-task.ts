"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";

export const deleteTask = async ({
  taskId,
  columnId,
}: {
  taskId: string;
  columnId: string;
}): Promise<ActionResponse> => {
  try {
    const deletedTask = await prismadb.task.delete({
      where: {
        id: taskId,
        columnId,
      },
      select: {
        column: {
          select: {
            board: true,
          },
        },
        title: true,
      },
    });

    // create new act
    await createActivity({
      workspaceId: deletedTask.column.board.workspaceId,
      content: `deleted task "${deletedTask.title}"`,
    });

    return { error: false, details: deletedTask };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
