import { rm } from "node:fs/promises";
import fileExists from "./fileexists";
import type { FoundDir } from "../types";

export interface RemoveError {
  path: string;
  error: unknown;
}

export default async function removeFileOrDir(dirs: FoundDir[]): Promise<RemoveError[]> {
  const errors: RemoveError[] = [];

  for (const dir of dirs) {
    if (await fileExists(dir.path)) {
      try {
        await rm(dir.path, { recursive: true, force: true });
      } catch (error) {
        errors.push({ path: dir.path, error });
      }
    }
  }

  return errors;
}
