import { lstat, readdir } from "node:fs/promises";
import path from "node:path";
import dirSize from "./dirsize";
import mapLimit from "./maplimit";
import type { FoundDir } from "../types";

const SEARCH_CONCURRENCY = 8;

export default async function searchDir(
  dirPath: string,
  searchName: string,
  foundDirs: FoundDir[],
  withSize = true
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
        const size = withSize ? await dirSize(childPath) : 0;
        foundDirs.push({ path: childPath, size });
      } else {
        await searchDir(childPath, searchName, foundDirs, withSize);
      }
    }
  });
}
