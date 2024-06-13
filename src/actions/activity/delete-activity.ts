"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";

export const deleteActivity = async ({
  activityId,
}: {
  activityId: string;
}): Promise<ActionResponse> => {
  try {
    // check if activity exists
    const resp = await prismadb.activity.delete({
      where: {
        id: activityId,
      },
    });
    if (!resp) {
      return { error: true, details: "Activity not found " };
    }
    const deletedActivity = await prismadb.activity.delete({
      where: {
        id: activityId,
      },
    });
    return { error: false, details: deletedActivity };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
