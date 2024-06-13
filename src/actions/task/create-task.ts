"use server";
import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";

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
