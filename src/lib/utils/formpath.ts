import { existsSync } from "node:fs";

export default function formPath(inputPath: string): string {
  if (inputPath === ".") {
    return process.cwd();
  }

  if (existsSync(inputPath)) {
    return inputPath;
  }

  throw new Error(`路径:${inputPath}不存在,请重新输入`);
}
