import type { Dirent } from "node:fs";
import { lstat, readdir } from "node:fs/promises";
import path from "node:path";
import mapLimit, { MAP_LIMIT } from "./maplimit.js";

export default async function dirSize(dirPath: string): Promise<number> {
  let totalSize = 0;
  const pendingDirs: string[] = [dirPath];

  while (pendingDirs.length > 0) {
    const currentDir = pendingDirs.pop();
    if (!currentDir) {
      continue;
    }

    let entries;
    try {
      entries = await readdir(currentDir, { withFileTypes: true });
    } catch {
      continue;
    }
    const childPathFor = (entry: Dirent): string => path.join(currentDir, entry.name);
    const files = entries.filter((e) => !e.isSymbolicLink() && !e.isDirectory()).map(childPathFor);
    const subDirs = entries.filter((e) => !e.isSymbolicLink() && e.isDirectory()).map(childPathFor);
    pendingDirs.push(...subDirs);

    await mapLimit(files, MAP_LIMIT, async (filePath) => {
      try {
        const stat = await lstat(filePath);
        totalSize += stat.size;
      } catch {
        // File vanished between readdir and lstat; skip it.
      }
    });
  }
  return totalSize;
}
