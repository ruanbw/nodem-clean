import { existsSync, statSync } from "node:fs";
import path from "node:path";

export default function formPath(inputPath: string): string {
  const normalizedPath = path.resolve(inputPath);

  if (existsSync(normalizedPath)) {
    const stat = statSync(normalizedPath);
    if (!stat.isDirectory()) {
      throw new Error(`Path ${normalizedPath} is not a directory, please try again`);
    }

    return normalizedPath;
  }

  throw new Error(`Path ${normalizedPath} does not exist, please try again`);
}
