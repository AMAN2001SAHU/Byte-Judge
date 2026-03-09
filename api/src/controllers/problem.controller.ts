import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import {
  CreateProblemInput,
  UpdateProblemInput,
} from "../validators/problem.validator";
import { includes, tuple } from "zod";

export const getAllProblems = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, difficulty, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (difficulty && typeof difficulty === "string") {
      where.difficulty = difficulty.toUpperCase();
    }

    if (search && typeof search === "string") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          acceptance: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.problem.count({ where }),
    ]);

    res.json({
      problems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching problems: ", error),
      res.status(500).json({ error: "Failed to fetch problems" });
  }
};

export const getProblemBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        examples: { orderBy: { order: "asc" } },
        constraints: { orderBy: { order: "asc" } },
        testcases: {
          where: { isHidden: false },
          orderBy: { order: "asc" },
          select: { id: true, input: true, output: true },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json(problem);
  } catch (error) {
    console.error("Error fetching problem: ", error);
    res.status(500).json({ error: "Failed to fetch problem" });
  }
};

export const createProblem = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateProblemInput;

    const existing = await prisma.problem.findUnique({
      where: { slug: data?.slug },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Problem with this slug already exists" });
    }

    const problem = await prisma.problem.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty,
        examples: {
          create: data.examples.map((ex, idx) => ({
            input: ex.input,
            output: ex.output,
            explanation: ex.explanation,
            order: idx,
          })),
        },
        constraints: {
          create: data.constraints.map((text, idx) => ({
            text,
            order: idx,
          })),
        },
        testcases: {
          create: data.testCases.map((tc, idx) => ({
            input: tc.input,
            output: tc.output,
            isHidden: tc.isHidden,
            order: idx,
          })),
        },
        tags: data.tags
          ? {
              create: await Promise.all(
                data.tags.map(async (tagName) => {
                  // Get or create tag
                  const tag = await prisma.tag.upsert({
                    where: { slug: tagName.toLowerCase().replace(/\s+/g, "-") },
                    create: {
                      name: tagName,
                      slug: tagName.toLowerCase().replace(/\s+/g, "-"),
                    },
                    update: {},
                  });
                  return { tagId: tag.id };
                })
              ),
            }
          : undefined,
      },
      include: {
        examples: true,
        constraints: true,
        testcases: true,
        tags: { include: { tag: true } },
      },
    });

    res.status(201).json(problem);
  } catch (error) {
    console.error("Error creating problem: ", error);
    res.status(500).json({ error: "Failed to create problem" });
  }
};

export const updateProblem = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const data = req.body as UpdateProblemInput;

    const existing = await prisma.problem.findUnique({
      where: { slug },
    });

    if (!existing) {
      return res.status(404).json({ error: "Problem not found" });
    }

    if (data.examples || data.constraints || data.testCases) {
      await Promise.all([
        data.examples
          ? prisma.example.deleteMany({ where: { problemId: existing.id } })
          : Promise.resolve(),
        data.constraints
          ? prisma.constraint.deleteMany({ where: { problemId: existing.id } })
          : Promise.resolve(),
        data.testCases
          ? prisma.testCase.deleteMany({ where: { problemId: existing.id } })
          : Promise.resolve(),
      ]);
    }

    const problem = await prisma.problem.update({
      where: { slug },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty,
        examples: data.examples
          ? {
              create: data.examples.map((ex, idx) => ({
                input: ex.input,
                output: ex.output,
                explanation: ex.explanation,
                order: idx,
              })),
            }
          : undefined,
        constraints: data.constraints
          ? {
              create: data.constraints.map((text, idx) => ({
                text,
                order: idx,
              })),
            }
          : undefined,
        testcases: data.testCases
          ? {
              create: data.testCases.map((tc, idx) => ({
                input: tc.input,
                output: tc.output,
                isHidden: tc.isHidden,
                order: idx,
              })),
            }
          : undefined,
      },
      include: {
        examples: true,
        constraints: true,
        testcases: true,
        tags: { include: { tag: true } },
      },
    });

    res.json(problem);
  } catch (error) {
    console.error("Error updating problem: ", error);
    res.status(500).json({ error: "Failed to update problem" });
  }
};

export const deleteProblem = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { slug },
    });

    if (!problem) {
      res.status(404).json({ error: "Problem not found" });
    }

    await prisma.problem.delete({
      where: { slug },
    });

    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem: ", error);
    res.status(500).json({ error: "Failed to delete problem" });
  }
};
