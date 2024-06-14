"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { getWorkspaceActivities } from "./get-activity";
import { Activity } from "@prisma/client";

export const deleteActivity = async ({
  activityId,
  workspaceId,
}: {
  activityId: string;
  workspaceId: string;
}): Promise<ActionResponse> => {
  try {
    // check if activity exists
    const resp = await prismadb.activity.delete({
      where: {
        id: activityId,
        workspaceId,
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

export const deleteWorkspaceActivities = async ({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<ActionResponse> => {
  try {
    // check if activity exists

    const resp = await getWorkspaceActivities({ workspaceId });

    if (resp?.error) {
      return resp;
    }
    const ativities: Activity[] = resp.details;

    await Promise.all(
      ativities.map((activity) => {
        return deleteActivity({ activityId: activity?.id, workspaceId });
      })
    );

    return { error: false, details: ativities };
  } catch (error) {
    console.log({ error });
    return { error: true, details: "something went wrong" };
  }
};
