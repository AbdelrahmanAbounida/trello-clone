"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";
import { deleteWorkspaceActivities } from "../activity/delete-activity";

export const deleteWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<ActionResponse> => {
  try {
    if (!workspaceId) {
      return { error: false, details: "" };
    }
    // delete all workspace activities
    const res = await deleteWorkspaceActivities({ workspaceId });

    if (res?.error) {
      return res;
    }

    // delete workspace
    const deletedWs = await prismadb.workspace.delete({
      where: {
        id: workspaceId,
      },
    });
    return { error: false, details: null };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
