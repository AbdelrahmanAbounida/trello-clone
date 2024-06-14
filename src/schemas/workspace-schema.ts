import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, { message: "min name length is 3 characters" }),
  logo: z
    .instanceof(File)
    .refine((file) => file.size < 10000000, {
      message: "Your logo must be less than 10MB.",
    })
    .optional(),
});
export type createWorkspaceSchemaType = z.infer<typeof createWorkspaceSchema>;

export interface WorkspacePageParams {
  params: {
    workspaceId: string;
  };
}
