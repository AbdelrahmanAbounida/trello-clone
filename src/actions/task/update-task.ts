"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { Task } from "@prisma/client";

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
