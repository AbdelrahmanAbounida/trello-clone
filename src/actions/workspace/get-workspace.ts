"use server";
import { prismadb } from "@/lib/db";
import { Workspace } from "@prisma/client";

export const getAllworkspaces = async ({
  userId,
}: {
  userId: string;
}): Promise<Workspace[]> => {
  const workspaces = await prismadb.workspace.findMany({
    where: {
      ownerId: userId,
      users: {
        every: {
          userId,
        },
      },
    },
  });

  return workspaces;
};

export const getWorkSpacebyName = async ({ name }: { name: string }) => {
  try {
    const ws = await prismadb.workspace.findFirst({
      where: {
        name,
      },
    });
    return ws;
  } catch (error) {
    console.log({ error });
    return;
  }
};

export const getWorkspacebyId = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const ws = await prismadb.workspace.findFirst({
      where: {
        id: workspaceId,
      },
    });
    return ws;
  } catch (error) {
    console.log({ error });
    return;
  }
};
