import { z } from "zod";

// ============================================
// USER VALIDATORS
// ============================================

export const userQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim()
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional()
    .nullable(),
  profileImage: z.string().url("Invalid image URL").optional().nullable(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type UserQueryInput = z.infer<typeof userQuerySchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
