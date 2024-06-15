"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";
import { deleteWorkspaceActivities } from "../activity/delete-activity";
import { auth } from "@/auth";

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

    // decrease limit
    // let userLimit = await prismadb.userLimit.findUnique({
    //   where: {
    //     userId: deletedWs?.ownerId,
    //   },
    // });

    // await prismadb.userLimit.update({
    //   where: {
    //     userId: deletedWs?.ownerId,
    //   },
    //   data: {
    //     count: userLimit?.count! > 0 ? userLimit?.count! - 1 : 0,
    //   },
    // });
    // await prismadb.userLimit.upsert({
    //   where: {
    //     userId: deletedWs?.ownerId,
    //   },
    //   update: {
    //     count: userLimit && userLimit?.count! > 0 ? userLimit?.count! - 1 : 0,
    //   },
    //   create: {
    //     userId: deletedWs?.ownerId!,
    //     count: userLimit && userLimit?.count > 0 ? userLimit?.count! - 1 : 0,
    //   },
    // });

    return { error: false, details: null };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
