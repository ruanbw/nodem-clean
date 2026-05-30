import { rm } from "node:fs/promises";
import mapLimit from "./maplimit";
import type { FoundDir } from "../types";

const REMOVE_CONCURRENCY = 8;

export interface RemoveError {
  path: string;
  error: unknown;
}

export default async function removeFileOrDir(
  dirs: FoundDir[]
): Promise<RemoveError[]> {
  const errors: RemoveError[] = [];

  await mapLimit(dirs, REMOVE_CONCURRENCY, async (dir) => {
    try {
      await rm(dir.path, { recursive: true, force: true });
    } catch (error) {
      errors.push({ path: dir.path, error });
    }
  });

  return errors;
}
