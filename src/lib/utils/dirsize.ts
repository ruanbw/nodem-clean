import { lstat, readdir } from "node:fs/promises";
import path from "node:path";

export default async function dirSize(dirPath: string): Promise<number> {
  let totalSize = 0;

  const pendingDirs: string[] = [dirPath];
  while (pendingDirs.length > 0) {
    const currentDir = pendingDirs.pop();
    if (!currentDir) {
      continue;
    }

    let children: string[];
    try {
      children = await readdir(currentDir);
    } catch {
      continue;
    }

    for (const child of children) {
      const childPath = path.join(currentDir, child);
      let res;
      try {
        res = await lstat(childPath);
      } catch {
        continue;
      }

      if (res.isSymbolicLink()) {
        continue;
      }

      if (res.isDirectory()) {
        pendingDirs.push(childPath);
      } else {
        totalSize += res.size;
      }
    }
  }

  return totalSize;
}
