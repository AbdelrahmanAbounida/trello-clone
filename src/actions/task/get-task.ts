"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";

export const getTaskById = async ({
  taskId,
}: {
  taskId: string;
}): Promise<ActionResponse> => {
  try {
    const task = await prismadb.task.findFirst({
      where: {
        id: taskId,
      },
      include: {
        column: {
          include: {
            board: true,
            tasks: true,
          },
        },
      },
    });
    return { error: false, details: task };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
