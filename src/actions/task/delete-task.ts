"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";

export const deleteTask = async ({
  taskId,
  columnId,
}: {
  taskId: string;
  columnId: string;
}): Promise<ActionResponse> => {
  try {
    await prismadb.task.delete({
      where: {
        id: taskId,
        columnId,
      },
    });
    return { error: false, details: "task deleted successfully" };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
