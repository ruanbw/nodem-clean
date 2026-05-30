import chalk from "chalk";
import ora from "ora";
import path from "node:path";
import formPath from "../../utils/formpath";
import searchDir from "../../utils/searchdir";
import removeFileOrDir from "../../utils/removefileordir";
import formatSize from "../../utils/formatsize";
import type { FoundDir } from "../../types";

interface KillerOptions {
  dryRun?: boolean;
  size?: boolean;
}

export default async function killerAction(
  inputPath: string,
  options: KillerOptions = {}
): Promise<void> {
  const foundDirs: FoundDir[] = [];
  const newPath = formPath(inputPath);
  const rootPath = path.parse(newPath).root;

  if (newPath === rootPath) {
    throw new Error(`禁止直接扫描根目录: ${newPath}`);
  }

  const withSize = options.size === true;
  const searchSpinner = ora().start("正在查找 node_modules 文件夹......\n");
  await searchDir(newPath, "node_modules", foundDirs, withSize);

  if (foundDirs.length === 0) {
    searchSpinner.succeed("未找到 node_modules 文件夹");
    return;
  }

  const totalSize = foundDirs.reduce((sum, dir) => sum + dir.size, 0);

  if (withSize) {
    searchSpinner.succeed(
      `共找到 ${foundDirs.length} 个 node_modules，合计 ${formatSize(totalSize)}`
    );
  } else {
    searchSpinner.succeed(`共找到 ${foundDirs.length} 个 node_modules`);
  }

  for (const dir of foundDirs) {
    if (withSize && dir.size > 0) {
      console.log(chalk.blue(`  ${dir.path}  (${formatSize(dir.size)})`));
    } else {
      console.log(chalk.blue(`  ${dir.path}`));
    }
  }

  if (options.dryRun) {
    if (withSize) {
      console.log(
        chalk.yellow(
          `\n[dry-run] 未删除任何文件。将释放约 ${formatSize(totalSize)}`
        )
      );
    } else {
      console.log(chalk.yellow("\n[dry-run] 未删除任何文件。"));
    }
    return;
  }

  const removeSpinner = ora().start("正在删除文件夹......\n");
  const removeErrors = await removeFileOrDir(foundDirs);

  if (removeErrors.length > 0) {
    removeSpinner.warn(`部分目录删除失败，失败数量: ${removeErrors.length}`);
    for (const removeError of removeErrors) {
      const message =
        removeError.error instanceof Error
          ? removeError.error.message
          : String(removeError.error);
      console.log(chalk.yellow(`删除失败: ${removeError.path} —— ${message}`));
    }
    return;
  }

  if (withSize) {
    removeSpinner.succeed(`删除完成，已释放约 ${formatSize(totalSize)}`);
  } else {
    removeSpinner.succeed("删除完成");
  }
}
