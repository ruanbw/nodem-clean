import chalk from "chalk";
import ora from "ora";
import path from "node:path";
import formPath from "../../utils/formpath";
import searchDir from "../../utils/searchdir";
import removeFileOrDir from "../../utils/removefileordir";
import type { FoundDir } from "../../types";

export default async function killerAction(inputPath: string): Promise<void> {
  const foundDirs: FoundDir[] = [];
  const newPath = formPath(inputPath);
  const rootPath = path.parse(newPath).root;

  if (newPath === rootPath) {
    throw new Error(`禁止直接扫描根目录: ${newPath}`);
  }

  const searchSpinner = ora().start("正在查找 node_modules 文件夹...... \n");
  await searchDir(newPath, "node_modules", foundDirs);

  if (foundDirs.length === 0) {
    searchSpinner.succeed("未找到 node_modules 文件夹");
    return;
  }

  for (const dir of foundDirs) {
    const sizeInKb = (dir.size / 1024).toFixed(2);
    searchSpinner.info(chalk.blue(`找到文件夹 ${dir.path} 大小为 ${sizeInKb} KB`));
  }

  const removeSpinner = ora().start("正在删除文件夹...... \n");
  const removeErrors = await removeFileOrDir(foundDirs);

  if (removeErrors.length > 0) {
    removeSpinner.warn(`部分目录删除失败，失败数量: ${removeErrors.length}`);
    for (const removeError of removeErrors) {
      removeSpinner.info(chalk.yellow(`删除失败: ${removeError.path}`));
    }
    return;
  }

  removeSpinner.succeed("删除完成");
}
