"use server";
import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";
import { getColumnById } from "./get-col";
import { ColumnWithTasks } from "@/schemas/drag-schemas";
import { createnewTask } from "../task/create-task";
import { Board, Column } from "@prisma/client";

export const createNewcolumn = async ({
  title,
  position,
  boardId,
}: {
  title: string;
  position: number;
  boardId: string;
}): Promise<ActionResponse> => {
  try {
    const col = await prismadb.column.create({
      data: {
        title,
        boardId,
        position,
      },
      select: {
        board: true,
      },
    });

    // create activity
    await createActivity({
      workspaceId: col.board.workspaceId,
      content: `created list "${title}"`,
    });

    return {
      error: false,
      details: col,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      details: "Something went wrong",
    };
  }
};

export const copyColumn = async ({
  colId,
}: {
  colId: string;
}): Promise<ActionResponse> => {
  try {
    // check if col exists
    const res = await getColumnById({ colId });

    if (res.error) {
      return res;
    }
    const col: ColumnWithTasks & { board: { columns: Column[] } } = res.details;
    // copy col
    const newcol = await prismadb.column.create({
      data: {
        title: `${col.title} (copy)`,
        boardId: col.boardId,
        position: col.board.columns.length,
      },
      select: {
        id: true,
        board: true,
        title: true,
      },
    });

    // create col tasks
    await Promise.all(
      col.tasks.map((task) => {
        return createnewTask({
          columnId: newcol.id,
          taskPos: task.position,
          taskTitle: task.title,
        });
      })
    );

    // activity
    await createActivity({
      workspaceId: newcol.board.workspaceId,
      content: `Copied list "${newcol.title}"`,
    });

    return { error: false, details: "Column copied successfully" };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong " };
  }
};
