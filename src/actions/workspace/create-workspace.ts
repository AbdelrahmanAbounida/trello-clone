"use server";
import { ActionResponse } from "@/schemas/action-resp";
import { prismadb } from "@/lib/db";
import { createActivity } from "../activity/create-activity";
import { MAX_WORKSPACE_LIMIT } from "@/constants/payment";

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

    // let userLimit = await prismadb.userLimit.findUnique({
    //   where: {
    //     userId,
    //   },
    // });
    // if (!userLimit) {
    //   userLimit = await prismadb.userLimit.create({
    //     data: {
    //       userId,
    //       count: 0,
    //     },
    //   });
    // }

    // if (userLimit.count >= MAX_WORKSPACE_LIMIT) {
    //   return {
    //     error: true,
    //     details:
    //       "You have reached the max limit. please upgrade to create more",
    //   };
    // }

    // 2- create new workspace
    const newWs = await prismadb.workspace.create({
      data: {
        ownerId: userId,
        name,
      },
    });

    // await prismadb.userLimit.update({
    //   where: {
    //     userId,
    //   },
    //   data: {
    //     count: userLimit.count + 1,
    //   },
    // });

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
