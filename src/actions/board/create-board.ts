"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";
import { createBoardSchema } from "@/schemas/board-schemas";
import { z } from "zod";
import { getBoardbyId } from "./get-board";
import { MAX_BOARDS_LIMIT } from "@/constants/payment";
import { validateSubscription } from "../stripe";

const CreateNewBoardPropsSchema = createBoardSchema
  .extend({
    workspaceId: z.string().min(1, { message: "workspaceId required" }),
  })
  .omit({
    imageFile: true,
  });
type CreateNewBoardProps = z.infer<typeof CreateNewBoardPropsSchema>;

export const createNewBoard = async ({
  isPublic,
  title,
  workspaceId,
}: CreateNewBoardProps): Promise<ActionResponse> => {
  //
  try {
    // 0- ::TODO :: check existence of workspace
    //   1- check board title uniqeness
    const newBoard = await prismadb.board.findFirst({
      where: {
        title,
      },
    });
    if (newBoard) {
      return {
        error: true,
        details: "You already have a board with this title",
      };
    }

    // 2- upload image to s3
    //   const imageUrl = await uploadImageToS3(imageFile);

    // check limit
    let wsLimit = await prismadb.workspaceLimit.findUnique({
      where: {
        workspaceId,
      },
    });
    if (!wsLimit) {
      wsLimit = await prismadb.workspaceLimit.create({
        data: {
          workspaceId,
          count: 0,
        },
      });
    }

    if (wsLimit.count >= MAX_BOARDS_LIMIT) {
      // check payment
      const sub = await prismadb.workspaceSubscription.findUnique({
        where: {
          workspaceId,
        },
      });
      const isValid = await validateSubscription({ workspaceId });
      console.log({ isValid });
      if (!isValid) {
        return {
          error: true,
          details:
            "You have reached the max limit. please upgrade to create more",
        };
      }
    }

    // Create new board
    const newCreatedBoard = await prismadb.board.create({
      data: {
        is_public: isPublic,
        title,
        workspaceId,
      },
    });

    // update limit
    await prismadb.workspaceLimit.update({
      where: {
        workspaceId,
      },
      data: {
        count: wsLimit.count + 1,
      },
    });

    // create activity
    await createActivity({
      workspaceId: newCreatedBoard.workspaceId,
      content: `created board "${newCreatedBoard.title}"`,
    });

    return { error: false, details: newCreatedBoard };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      details: "Something went wrong",
    };
  }
};

export const copyBoard = async ({
  boardId,
}: {
  boardId: string;
}): Promise<ActionResponse> => {
  try {
    const board = await getBoardbyId({ boardId });
    if (!board) {
      return { error: true, details: "board not found" };
    }
    // check limit
    let wsLimit = await prismadb.workspaceLimit.findUnique({
      where: {
        workspaceId: board?.workspaceId,
      },
    });

    if (wsLimit?.count! >= MAX_BOARDS_LIMIT) {
      return {
        error: true,
        details:
          "You have reached the max limit. please upgrade to create more",
      };
    }

    // Copy the board
    const newBoard = await prismadb.board.create({
      data: {
        title: `${board.title} (Copy)`,
        is_public: board.is_public,
        backgroundImage: board.backgroundImage,
        workspaceId: board.workspaceId,
      },
    });

    // update limit
    await prismadb.workspaceLimit.update({
      where: {
        workspaceId: newBoard?.workspaceId,
      },
      data: {
        count: wsLimit?.count! + 1,
      },
    });

    await Promise.all(
      board.columns.map(async (column) => {
        // Copy the columns
        const col = await prismadb.column.create({
          data: {
            title: column.title,
            position: column.position,
            boardId: newBoard.id,
          },
          select: {
            tasks: true,
            id: true,
          },
        });
        // copy tasks
        await Promise.all(
          column.tasks.map((task) => {
            return prismadb.task.create({
              data: {
                position: task.position,
                title: task.title,
                columnId: col.id,
              },
            });
          })
        );
      })
    );

    await createActivity({
      workspaceId: newBoard.workspaceId,
      content: `copied board "${newBoard.title}"`,
    });

    return { error: false, details: newBoard };
  } catch (error) {
    console.log({ error });
    return { error: false, details: "Failed copying board" };
  }
};
