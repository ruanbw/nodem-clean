import { rm } from "node:fs/promises";
import fileExists from "./fileexists";
import type { FoundDir } from "../types";

export default async function removeFileOrDir(dirs: FoundDir[]): Promise<void> {
  for (const dir of dirs) {
    if (await fileExists(dir.path)) {
      await rm(dir.path, { recursive: true });
    }
  }
}
