import { lstat, readdir } from "node:fs/promises";
import path from "node:path";
import dirSize from "./dirsize";
import type { FoundDir } from "../types";

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

  for (const child of children) {
    const childPath = path.join(dirPath, child);
    let res;
    try {
      res = await lstat(childPath);
    } catch {
      continue;
    }

    if (res.isSymbolicLink()) {
      continue;
    }

    if (res.isDirectory() && !child.startsWith(".")) {
      if (child === searchName) {
        const size = await dirSize(childPath);
        foundDirs.push({ path: childPath, size });
      } else {
        await searchDir(childPath, searchName, foundDirs);
      }
    }
  }
}
