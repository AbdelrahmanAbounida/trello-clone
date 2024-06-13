"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";

export const deleteWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<ActionResponse> => {
  try {
    const deletedWs = await prismadb.workspace.delete({
      where: {
        id: workspaceId,
      },
    });

    // create new act
    // await createActivity({
    //     workspaceId,
    //     content: `deleted workspace "${deletedWs.name}"`,
    //   });

    return { error: false, details: null };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
