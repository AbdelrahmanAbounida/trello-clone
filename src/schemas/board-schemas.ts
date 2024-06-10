import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(3, { message: "min title length is 3 characters" }),
  // imageFile: z.any().refine((val) => val?.length > 0, "image file is required"),
  imageFile: z.instanceof(File).refine((file) => file.size < 10000000, {
    message: "Your image must be less than 10MB.",
  }),
  isPublic: z.boolean().default(false),
});
export type createBoardSchemaType = z.infer<typeof createBoardSchema>;
