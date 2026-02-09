import { z } from "zod";

// ============================================
// GROUP VALIDATORS
// ============================================

export const createGroupSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),
  timeline: z
    .string()
    .min(1, "Timeline is required")
    .max(100, "Timeline must not exceed 100 characters")
    .optional(),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10, "Maximum 10 tags allowed")
    .optional()
    .default([]),
});

export const updateGroupSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim()
    .optional(),
  timeline: z
    .string()
    .min(1, "Timeline is required")
    .max(100, "Timeline must not exceed 100 characters")
    .optional(),
  isActive: z.boolean().optional(),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
});

export const groupQuerySchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  creatorId: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type GroupQueryInput = z.infer<typeof groupQuerySchema>;
