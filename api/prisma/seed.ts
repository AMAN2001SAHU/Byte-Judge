import { PrismaClient, Difficulty, Category, Language } from "@prisma/client";

const prisma = new PrismaClient();

type Example = {
  input: object;
  output: object;
  explanation?: string;
};

type TestCase = {
  input: object;
  output: object;
  isHidden: boolean;
};

type StarterCodeEntry = {
  language: Language;
  code: string;
};

type ProblemSeed = {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  acceptance: number;
  examples: Example[];
  constraints: string[];
  testCases: TestCase[];
  tags: string[];
  starterCode: StarterCodeEntry[];
};

const problems: ProblemSeed[] = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: Difficulty.EASY,
    category: Category.ARRAY,
    acceptance: 48.2,
    examples: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: { result: [0, 1] },
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        output: { result: [1, 2] },
      },
      {
        input: { nums: [3, 3], target: 6 },
        output: { result: [0, 1] },
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: { result: [0, 1] },
        isHidden: false,
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        output: { result: [1, 2] },
        isHidden: false,
      },
      {
        input: { nums: [3, 3], target: 6 },
        output: { result: [0, 1] },
        isHidden: true,
      },
      {
        input: { nums: [1, 2, 3, 4, 5], target: 9 },
        output: { result: [3, 4] },
        isHidden: true,
      },
      {
        input: { nums: [-1, -2, -3, -4, -5], target: -8 },
        output: { result: [2, 4] },
        isHidden: true,
      },
    ],
    tags: ["Array", "Hash Table"],
    starterCode: [
      {
        language: Language.CPP,
        code: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
    }
};`,
      },
      {
        language: Language.PYTHON,
        code: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass`,
      },
      {
        language: Language.JAVASCRIPT,
        code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
};`,
      },
    ],
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: Difficulty.EASY,
    category: Category.STACK,
    acceptance: 40.7,
    examples: [
      {
        input: { s: "()" },
        output: { result: true },
      },
      {
        input: { s: "()[]{}" },
        output: { result: true },
      },
      {
        input: { s: "(]" },
        output: { result: false },
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    testCases: [
      { input: { s: "()" }, output: { result: true }, isHidden: false },
      { input: { s: "()[]{}" }, output: { result: true }, isHidden: false },
      { input: { s: "(]" }, output: { result: false }, isHidden: false },
      { input: { s: "([)]" }, output: { result: false }, isHidden: true },
      { input: { s: "{[]}" }, output: { result: true }, isHidden: true },
      { input: { s: "" }, output: { result: true }, isHidden: true },
      { input: { s: "(((" }, output: { result: false }, isHidden: true },
    ],
    tags: ["String", "Stack"],
    starterCode: [
      {
        language: Language.CPP,
        code: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
    }
};`,
      },
      {
        language: Language.PYTHON,
        code: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        pass`,
      },
      {
        language: Language.JAVASCRIPT,
        code: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Write your solution here
};`,
      },
    ],
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    difficulty: Difficulty.MEDIUM,
    category: Category.ARRAY,
    acceptance: 46.4,
    examples: [
      {
        input: {
          intervals: [
            [1, 3],
            [2, 6],
            [8, 10],
            [15, 18],
          ],
        },
        output: {
          result: [
            [1, 6],
            [8, 10],
            [15, 18],
          ],
        },
        explanation:
          "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: {
          intervals: [
            [1, 4],
            [4, 5],
          ],
        },
        output: { result: [[1, 5]] },
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4",
    ],
    testCases: [
      {
        input: {
          intervals: [
            [1, 3],
            [2, 6],
            [8, 10],
            [15, 18],
          ],
        },
        output: {
          result: [
            [1, 6],
            [8, 10],
            [15, 18],
          ],
        },
        isHidden: false,
      },
      {
        input: {
          intervals: [
            [1, 4],
            [4, 5],
          ],
        },
        output: { result: [[1, 5]] },
        isHidden: false,
      },
      {
        input: { intervals: [[1, 4]] },
        output: { result: [[1, 4]] },
        isHidden: true,
      },
      {
        input: {
          intervals: [
            [1, 4],
            [0, 4],
          ],
        },
        output: { result: [[0, 4]] },
        isHidden: true,
      },
      {
        input: {
          intervals: [
            [1, 4],
            [0, 1],
          ],
        },
        output: { result: [[0, 4]] },
        isHidden: true,
      },
      {
        input: {
          intervals: [
            [1, 4],
            [2, 3],
          ],
        },
        output: { result: [[1, 4]] },
        isHidden: true,
      },
    ],
    tags: ["Array", "Sorting"],
    starterCode: [
      {
        language: Language.CPP,
        code: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your solution here
    }
};`,
      },
      {
        language: Language.PYTHON,
        code: `from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # Write your solution here
        pass`,
      },
      {
        language: Language.JAVASCRIPT,
        code: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    // Write your solution here
};`,
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  for (const p of problems) {
    const tagRecords = await Promise.all(
      p.tags.map((name) =>
        prisma.tag.upsert({
          where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
          create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
          update: {},
        })
      )
    );

    const problem = await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        difficulty: p.difficulty,
        category: p.category,
        acceptance: p.acceptance,
        examples: {
          create: p.examples.map((ex, idx) => ({
            input: ex.input,
            output: ex.output,
            explanation: ex.explanation,
            order: idx,
          })),
        },
        constraints: {
          create: p.constraints.map((text, idx) => ({ text, order: idx })),
        },
        testcases: {
          create: p.testCases.map((tc, idx) => ({
            input: tc.input,
            output: tc.output,
            isHidden: tc.isHidden,
            order: idx,
          })),
        },
        starterCode: {
          create: p.starterCode.map((sc) => ({
            language: sc.language,
            code: sc.code,
          })),
        },
        tags: {
          create: tagRecords.map((tag) => ({ tagId: tag.id })),
        },
      },
    });
    console.log(`  ✅ Seeded: ${problem.title}`);
  }
  console.log("✅ Seeding complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
