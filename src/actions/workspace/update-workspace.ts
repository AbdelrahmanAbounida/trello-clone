"use server";
import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";

export const renameWorkspace = async ({
  workspaceId,
  newName,
}: {
  workspaceId: string;
  newName: string;
}): Promise<ActionResponse> => {
  try {
    if (!workspaceId) {
      return { error: true, details: "workspaceid shouldn't be none " };
    }
    const updatedWs = await prismadb.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        name: newName,
      },
    });
    // create new act
    await createActivity({
      workspaceId: updatedWs.id,
      content: `updated workspace "${updatedWs.name}"`,
    });
    return { error: false, details: updatedWs };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
