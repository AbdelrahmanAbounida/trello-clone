"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { Task } from "@prisma/client";
import { createActivity } from "../activity/create-activity";

export const updateTaskPosition = async ({
  newPos,
  task,
}: {
  newPos: number;
  task: Task;
}): Promise<ActionResponse> => {
  try {
    if (!task) {
      return { error: true, details: "Task is null" };
    }
    const resp = await prismadb.task.update({
      where: {
        id: task.id,
      },
      data: {
        position: newPos,
      },
    });
    return { error: false, details: resp };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};

export const updateColTaskPositions = async ({
  newColTasks,
  columnId,
  updateType = "active",
}: {
  newColTasks: Task[];
  columnId: string;
  updateType: "active" | "over";
}): Promise<ActionResponse> => {
  // it will take ordered tasks and store them according to that order
  try {
    if (updateType == "active") {
      await Promise.all(
        newColTasks.map((task, index) => {
          return prismadb.task.update({
            where: {
              id: task.id,
              columnId: task.columnId,
            },
            data: {
              position: index,
            },
          });
        })
      );
    } else {
      await Promise.all(
        newColTasks.map((task, index) => {
          return prismadb.task.update({
            where: {
              id: task.id,
            },
            data: {
              position: index,
              columnId: task.columnId,
            },
          });
        })
      );
    }

    return { error: false, details: "tasks positions updated successfully" };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};

export const updateTaskDescription = async ({
  taskId,
  workspaceId,
  newDescription,
}: {
  taskId: string;
  workspaceId: string;
  newDescription: string;
}): Promise<ActionResponse> => {
  try {
    const updatedTask = await prismadb.task.update({
      where: {
        id: taskId,
      },
      data: {
        description: newDescription,
      },
    });

    // create new act
    await createActivity({
      workspaceId,
      content: `updated task description "${updatedTask.title}"`,
    });
    return { error: false, details: updatedTask };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};

export const renameTask = async ({
  taskId,
  newtitle,
}: {
  taskId: string;
  newtitle: string;
}): Promise<ActionResponse> => {
  try {
    const updatedTask = await prismadb.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: newtitle,
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
      workspaceId: updatedTask.column.board.workspaceId,
      content: `renamed task to "${newtitle}"`,
    });
    return { error: false, details: updatedTask };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
