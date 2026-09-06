import { readdir } from "node:fs/promises";
import path from "node:path";
import dirSize from "./dirsize.js";
import { MAP_LIMIT } from "./maplimit.js";
import type { FoundDir } from "../types.js";

export default async function searchDir(
  dirPath: string,
  searchName: string,
  foundDirs: FoundDir[],
  withSize = true
): Promise<void> {
  // BFS work queue: `pending` grows as directories are discovered. Global
  // concurrency is capped at MAP_LIMIT regardless of tree depth, unlike
  // per-level mapLimit fan-out which grows as limit^depth.
  const pending: string[] = [dirPath];
  let cursor = 0;
  let inflight = 0;

  return new Promise<void>((resolve) => {
    const scanDir = async (dir: string): Promise<void> => {
      let entries;
      try {
        entries = await readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        if (entry.isSymbolicLink() || !entry.isDirectory() || entry.name.startsWith(".")) {
          continue;
        }

        const childPath = path.join(dir, entry.name);
        if (entry.name === searchName) {
          const size = withSize ? await dirSize(childPath) : 0;
          foundDirs.push({ path: childPath, size });
        } else {
          pending.push(childPath);
        }
      }
    };

    const drain = (): void => {
      while (inflight < MAP_LIMIT && cursor < pending.length) {
        const dir = pending[cursor];
        cursor += 1;
        inflight += 1;
        void scanDir(dir).then(() => {
          inflight -= 1;
          drain();
          if (inflight === 0 && cursor >= pending.length) {
            resolve();
          }
        });
      }

      if (inflight === 0 && cursor >= pending.length) {
        resolve();
      }
    };

    drain();
  });
}
