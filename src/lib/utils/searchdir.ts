import { lstat, readdir } from "node:fs/promises";
import path from "node:path";
import dirSize from "./dirsize";
import type { FoundDir } from "../types";

const SEARCH_CONCURRENCY = 8;

async function mapLimit<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let index = 0;

  async function run(): Promise<void> {
    while (true) {
      const currentIndex = index;
      index += 1;
      if (currentIndex >= items.length) {
        return;
      }
      await worker(items[currentIndex]);
    }
  }

  const workerCount = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => run()));
}

export default async function searchDir(
  dirPath: string,
  searchName: string,
  foundDirs: FoundDir[]
): Promise<void> {
  let children: string[];
  try {
    children = await readdir(dirPath);
  } catch {
    return;
  }

  await mapLimit(children, SEARCH_CONCURRENCY, async (child) => {
    const childPath = path.join(dirPath, child);
    let res;
    try {
      res = await lstat(childPath);
    } catch {
      return;
    }

    if (res.isSymbolicLink()) {
      return;
    }

    if (res.isDirectory() && !child.startsWith(".")) {
      if (child === searchName) {
        const size = await dirSize(childPath);
        foundDirs.push({ path: childPath, size });
      } else {
        await searchDir(childPath, searchName, foundDirs);
      }
    }
  });
}
