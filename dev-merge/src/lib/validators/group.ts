import { z } from "zod";

export const createGroupSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  timeline: z.string().optional(),
});
