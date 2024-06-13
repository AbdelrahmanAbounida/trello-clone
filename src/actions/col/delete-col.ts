"use server";

import { ActionResponse } from "@/schemas/action-resp";
import { getColumnById } from "./get-col";
import { ColumnWithTasks } from "@/schemas/drag-schemas";
import { prismadb } from "@/lib/db";
import { createActivity } from "../activity/create-activity";

export const deleteColumn = async ({
  colId,
  withActivity,
}: {
  colId: string;
  withActivity: boolean;
}): Promise<ActionResponse> => {
  try {
    const resp = await deleteColumnTasks({ colId });

    if (resp?.error) {
      return resp;
    }

    // delete col
    const deletedCol = await prismadb.column.delete({
      where: {
        id: resp.details?.id,
      },
      select: {
        board: true,
        title: true,
      },
    });

    // delete col activity
    if (withActivity) {
      await createActivity({
        workspaceId: deletedCol.board.workspaceId,
        content: `deleted list "${deletedCol.title}"`,
      });
    }

    return { error: false, details: null };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "Something went wrong" };
  }
};

export const deleteColumnTasks = async ({
  colId,
}: {
  colId: string;
}): Promise<ActionResponse> => {
  try {
    // 0- check if col exists
    const resp = await getColumnById({ colId });

    if (resp.error) {
      return resp;
    }
    const col: ColumnWithTasks = resp.details;

    // 1- create col tasks
    await Promise.all(
      col.tasks.map((task) => {
        return prismadb.task.delete({
          where: {
            id: task.id,
          },
        });
      })
    );
    return { error: false, details: col };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "Something went wrong" };
  }
};
