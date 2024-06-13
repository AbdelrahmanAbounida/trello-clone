"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";

/**
 * cases in which we gonna create a new activity 

*** Workspace Activities ***
- Workspace Created ✅
- Workspace Renamed ✅

*** Board Created ***
- Board created  ✅
- Board Renamed ✅
- Board Deleted ✅


*** Column Activities ***
- Column Created  ✅
- Column Renamed ✅
- Column Deleted ✅

*** Task Activities ***
- Task Created ✅
- Task Renamed ✅
- Task Deleted ✅
- Task Description Updated ✅

*** Other ***
- User Added to Board
- User Removed from Board

 */

export const createActivity = async ({
  workspaceId,
  content,
}: {
  workspaceId: string;
  content: string;
}): Promise<ActionResponse> => {
  try {
    const activity = await prismadb.activity.create({
      data: {
        content,
        workspaceId,
      },
    });

    return { error: false, details: activity };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
