import { lstat, readdir } from "node:fs/promises";
import path from "node:path";

export default async function dirSize(dirPath: string): Promise<number> {
  let totalSize = 0;

  let children: string[];
  try {
    children = await readdir(dirPath);
  } catch {
    return 0;
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

    if (res.isDirectory()) {
      totalSize += await dirSize(childPath);
    } else {
      totalSize += res.size;
    }
  }

  return totalSize;
}
