import { z } from "zod";

const createBoard = z.object({
  title: z.string().min(3, { message: "min title length is 3 characters" }),
  imageFile: z.any().refine((val) => val.length > 0, "image file is required"),
});
export type createBoardSchema = z.infer<typeof createBoard>;
