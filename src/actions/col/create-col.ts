"use server";
import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";

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
