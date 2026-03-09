import { Router } from "express";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemBySlug,
  updateProblem,
} from "../controllers/problem.controller";
import { validateRequest } from "../middleware/validate";
import {
  createProblemSchema,
  updateProblemSchema,
} from "../validators/problem.validator";

const router = Router();
router.get("/", getAllProblems);
router.get("/:slug", getProblemBySlug);
router.post("/", validateRequest(createProblemSchema), createProblem);
router.put("/:slug", validateRequest(updateProblemSchema), updateProblem);
router.delete("/:slug", deleteProblem);

export default router;
