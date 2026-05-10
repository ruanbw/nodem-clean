import { existsSync, lstatSync } from "node:fs";
import path from "node:path";

export default function formPath(inputPath: string): string {
  const normalizedPath = inputPath === "." ? process.cwd() : path.resolve(inputPath);

  if (existsSync(normalizedPath)) {
    const stat = lstatSync(normalizedPath);
    if (!stat.isDirectory()) {
      throw new Error(`路径:${normalizedPath}不是目录,请重新输入`);
    }

    return normalizedPath;
  }

  throw new Error(`路径:${normalizedPath}不存在,请重新输入`);
}
