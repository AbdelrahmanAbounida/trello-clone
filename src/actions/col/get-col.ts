"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";

export const getColumnById = async ({
  colId,
}: {
  colId: string;
}): Promise<ActionResponse> => {
  try {
    const col = await prismadb.column.findFirst({
      where: {
        id: colId,
      },
      select: {
        tasks: true,
      },
    });
    return { error: false, details: col };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
