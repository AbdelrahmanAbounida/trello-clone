"use server";
import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";

export const createnewTask = async ({
  columnId,
  taskTitle,
  taskPos,
}: {
  columnId: string;
  taskTitle: string;
  taskPos: number;
}): Promise<ActionResponse> => {
  try {
    const newTask = await prismadb.task.create({
      data: {
        title: taskTitle,
        columnId,
        position: taskPos,
      },
      select: {
        column: {
          select: {
            board: true,
          },
        },
      },
    });

    // create new act
    await createActivity({
      workspaceId: newTask.column.board.workspaceId,
      content: `created task "${taskTitle}"`,
    });

    return {
      error: false,
      details: newTask,
    };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
