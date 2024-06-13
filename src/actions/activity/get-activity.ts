"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";

export const getTaskActivities = async ({
  taskId,
  columnId,
}: {
  taskId: string;
  columnId: string;
}): Promise<ActionResponse> => {
  try {
    const activites = await prismadb.task.findMany({
      where: {
        id: taskId,
        columnId,
      },
    });
    return { error: false, details: activites };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
