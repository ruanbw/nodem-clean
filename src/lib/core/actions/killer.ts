import chalk from "chalk";
import ora from "ora";
import formPath from "../../utils/formpath";
import searchDir from "../../utils/searchdir";
import removeFileOrDir from "../../utils/removefileordir";
import type { FoundDir } from "../../types";

export default async function killerAction(inputPath: string): Promise<void> {
  const foundDirs: FoundDir[] = [];
  const newPath = formPath(inputPath);

  const searchSpinner = ora().start("正在查找 node_modules 文件夹...... \n");
  await searchDir(newPath, "node_modules", foundDirs);

  for (const dir of foundDirs) {
    searchSpinner.info(chalk.blue(`找到文件夹 ${dir.path} 大小为 ${dir.size} kb`));
  }

  const removeSpinner = ora().start("正在删除文件夹...... \n");
  await removeFileOrDir(foundDirs);
  removeSpinner.succeed("删除完成");
}
