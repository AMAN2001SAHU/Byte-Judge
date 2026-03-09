import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { runCPP } from "./judge/runCPP";
import { runPython } from "./judge/runPython";
import problemRoutes from "./routes/problem.routes";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later",
});

app.use(limiter);
app.use("/api/problems", problemRoutes);

app.post("/api/run", async (req, res) => {
  try {
    const { code, language, stdin } = req.body as {
      code: string;
      language: "cpp" | "python";
      stdin?: string;
    };

    // Valid input
    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    if (code.trim().length === 0) {
      return res.status(400).json({ error: "Code cannot be empty" });
    }

    if (code.length > 100000) {
      return res
        .status(400)
        .json({ error: "Code exceeds maximum length of 100KB" });
    }

    if (language !== "cpp" && language !== "python") {
      return res
        .status(400)
        .json({ error: "Only C++ and Python are supported" });
    }

    let result;

    if (language === "cpp") {
      result = await runCPP(code, stdin);
    } else {
      result = await runPython(code, stdin);
    }

    res.json({
      status: "ok",
      language: language,
      verdict:
        result.exitCode === 0
          ? "ACCEPTED"
          : result.exitCode === 124
          ? "TLE"
          : "RUNTIME_ERROR",
      ...result,
    });
  } catch (error) {
    console.error("Error executing code: ", error);
    res.status(500).json({
      error: "Internal server error while executing code",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/", (req, res) => {
  res.send("API working fine");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Starting the API server on PORT ${PORT}`);
});
