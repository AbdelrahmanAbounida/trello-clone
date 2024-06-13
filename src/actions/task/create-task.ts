"use server";
import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";
import { getTaskById } from "./get-task";
import { Board, Task } from "@prisma/client";
import { TaskWithcolumn } from "@/schemas/drag-schemas";

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

export const copyTask = async ({
  taskId,
}: {
  taskId: string;
}): Promise<ActionResponse> => {
  try {
    // check if col exists
    const res = await getTaskById({ taskId });

    if (res.error) {
      return res;
    }
    const task: TaskWithcolumn & { board: Board } = res.details;
    // copy col
    const newTask = await prismadb.task.create({
      data: {
        title: `${task.title} (copy)`,
        columnId: task.columnId,
        position: task.column.tasks.length,
      },
      select: {
        column: {
          select: {
            board: true,
          },
        },
      },
    });

    // activity
    await createActivity({
      workspaceId: newTask.column.board.workspaceId,
      content: `Copied task "${task.title}"`,
    });

    return { error: false, details: "Column copied successfully" };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong " };
  }
};
