import { Category, Language } from "@prisma/client";
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
  category: z.enum([
    "ARRAY",
    "STRING",
    "LINKED_LIST",
    "TREE",
    "GRAPH",
    "DYNAMIC_PROGRAMMING",
    "SORTING",
    "SEARCHING",
    "HASHING",
    "TWO_POINTERS",
    "SLIDING_WINDOW",
    "BACKTRACKING",
    "GREEDY",
    "MATH",
    "BIT_MANIPULATION",
    "STACK",
    "QUEUE",
    "HEAP",
  ]),
  examples: z
    .array(
      z.object({
        input: z.any(),
        output: z.any(),
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
        input: z.any(),
        output: z.any(),
        isHidden: z.boolean().default(false),
      })
    )
    .min(1, "At least one test case is required"),
  starterCodes: z
    .array(
      z.object({
        language: z.enum(["CPP", "PYTHON", "JAVASCRIPT"]),
        code: z.string(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProblemSchema = createProblemSchema.partial();

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof createProblemSchema>;
