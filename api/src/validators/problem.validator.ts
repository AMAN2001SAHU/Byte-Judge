import { z } from "zod";

export const createProblemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  examples: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string().optional(),
      })
    )
    .min(1, "At least one example is required"),
  constraints: z
    .array(z.string())
    .min(1, "At least one constraint is required"),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        isHidden: z.boolean().default(false),
      })
    )
    .min(1, "At least one test case is required"),
  tags: z.array(z.string()).optional(),
});

export const updateProblemSchema = createProblemSchema.partial();

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof createProblemSchema>;
