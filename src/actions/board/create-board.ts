"use server";

import { prismadb } from "@/lib/db";
import { ActionResponse } from "@/schemas/action-resp";
import { createActivity } from "../activity/create-activity";
import { createBoardSchema } from "@/schemas/board-schemas";
import { z } from "zod";

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

    // Create new board
    const newCreatedBoard = await prismadb.board.create({
      data: {
        is_public: isPublic,
        title,
        workspaceId,
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
