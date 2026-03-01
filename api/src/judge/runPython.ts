import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { performance } from "perf_hooks";
import { cleanupTempDir, createTempDir } from "../utils/temp";
import { JudgeResult } from "./types";

const DOCKER_IMAGE = "python:3.11-slim";
const TIME_LIMIT_MS = 5000;

export function runPython(code: string, stdin = ""): Promise<JudgeResult> {
  return new Promise((resolve) => {
    const dir = createTempDir();
    const pyFile = path.join(dir, "main.py");

    fs.writeFileSync(pyFile, code);

    const escapedStdin = stdin.replace(/'/g, `'\\''`);
    const escapedDir = dir.replace(/'/g, `'\\''`);

    const dockerCmd = `
docker run --rm \
  --memory=512m \
  --cpus=1 \
  --network=none \
  -v "${escapedDir}:/work" \
  -w /work \
  ${DOCKER_IMAGE} \
  bash -c "printf '%s' '${escapedStdin}' | python3 main.py"
`.trim();

    const start = performance.now();

    exec(
      dockerCmd,
      { timeout: TIME_LIMIT_MS, maxBuffer: 10 * 1024 * 1024 },
      (err, stdout, stderr) => {
        const end = performance.now();
        cleanupTempDir(dir);

        if (err) {
          resolve({
            exitCode: (err as any).code ?? 1,
            stdout: stdout?.toString() ?? "",
            stderr: stderr?.toString() || err.message,
            timeMs: Math.round(end - start),
          });
          return;
        }

        resolve({
          exitCode: 0,
          stdout: stdout.toString(),
          stderr: stderr.toString(),
          timeMs: Math.round(end - start),
        });
      }
    );
  });
}
