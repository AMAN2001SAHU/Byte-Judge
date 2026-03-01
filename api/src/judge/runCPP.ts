import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { performance } from "perf_hooks";
import { cleanupTempDir, createTempDir } from "../utils/temp";
import { JudgeResult } from "./types";

const DOCKER_IMAGE = "gcc:13";
const TIME_LIMIT_MS = 5000;

export function runCPP(code: string, stdin = ""): Promise<JudgeResult> {
  return new Promise((resolve) => {
    const dir = createTempDir();
    const cppFile = path.join(dir, "main.cpp");

    fs.writeFileSync(cppFile, code);

    // console.log("stdin ", stdin);
    const escapedStdin = stdin.replace(/'/g, `'\\''`);
    const escapedDir = dir.replace(/'/g, `'\\''`);
    // console.log("escapedStdin ", escapedStdin);

    // const data = fs.readFileSync(cppFile, "utf8");
    // console.log("C++ File Content:\n", data);

    const dockerCmd = `
        docker run --rm \
        --memory=512m \
        --cpus=1 \
        --network=none \
        -v '${escapedDir}:/work' \
        -w /work \
        ${DOCKER_IMAGE} \
        bash -c "g++ main.cpp -O2 -std=c++17 -o main && printf '%s' '${escapedStdin}' | ./main"
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
