import fs from "fs";
import path from "path";

const RUN_DIR = path.join(process.cwd(), "runs");

export function createTempDir(): string {
  if (!fs.existsSync(RUN_DIR)) {
    fs.mkdirSync(RUN_DIR, {recursive: true});
  }

  const dir = path.join(RUN_DIR, Date.now().toString());
  fs.mkdirSync(dir);
  return dir;
}

export function cleanupTempDir(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}
