"use server";
import { ActionResponse } from "@/schemas/action-resp";
import { prismadb } from "@/lib/db";
import { createActivity } from "../activity/create-activity";

export const createNewWorkSpace = async ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}): Promise<ActionResponse> => {
  try {
    // 0- check auth
    if (!userId) {
      return {
        error: true,
        details: "You are not authorized",
      };
    }
    // 1- check if workspace exists
    const isExist = await prismadb.workspace.findFirst({
      where: {
        name,
      },
    });
    console.log({ isExist });
    if (isExist) {
      return {
        error: true,
        details: "There is a workspace with the same name please.",
      };
    }

    // 2- create new workspace
    const newWs = await prismadb.workspace.create({
      data: {
        ownerId: userId,
        name,
      },
    });

    // create activity
    await createActivity({
      workspaceId: newWs.id,
      content: `created workspace "${newWs.name}"`,
    });

    return {
      error: false,
      details: newWs,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      details: "Something went wrong while creating new workspace ",
    };
  }
};
