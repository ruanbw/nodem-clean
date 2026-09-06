import { rm } from "node:fs/promises";
import mapLimit, { MAP_LIMIT } from "./maplimit.js";
import type { FoundDir } from "../types.js";

export interface RemoveError {
  path: string;
  error: unknown;
}

export default async function removeFileOrDir(
  dirs: FoundDir[]
): Promise<RemoveError[]> {
  const errors: RemoveError[] = [];

  await mapLimit(dirs, MAP_LIMIT, async (dir) => {
    try {
      await rm(dir.path, { recursive: true, force: true });
    } catch (error) {
      errors.push({ path: dir.path, error });
    }
  });

  return errors;
}
