import chalk from "chalk";
import ora from "ora";
import path from "node:path";
import formPath from "../../utils/formpath.js";
import searchDir from "../../utils/searchdir.js";
import removeFileOrDir from "../../utils/removefileordir.js";
import formatSize from "../../utils/formatsize.js";
import type { FoundDir } from "../../types.js";

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
    throw new Error(`Refusing to scan the root directory directly: ${newPath}`);
  }

  const withSize = options.size === true;
  const searchSpinner = ora().start("正在查找 node_modules 文件夹......\n");
  await searchDir(newPath, "node_modules", foundDirs, withSize);

  if (foundDirs.length === 0) {
    searchSpinner.succeed("未找到 node_modules 文件夹");
    return;
  }

  const totalSize = foundDirs.reduce((sum, dir) => sum + dir.size, 0);
  const totalSizeText = withSize ? `，合计 ${formatSize(totalSize)}` : "";

  searchSpinner.succeed(`共找到 ${foundDirs.length} 个 node_modules${totalSizeText}`);

  for (const dir of foundDirs) {
    const sizeText = withSize && dir.size > 0 ? `  (${formatSize(dir.size)})` : "";
    console.log(chalk.blue(`  ${dir.path}${sizeText}`));
  }

  if (options.dryRun) {
    const dryRunText = withSize ? `。将释放约 ${formatSize(totalSize)}` : "。";
    console.log(chalk.yellow(`\n[dry-run] 未删除任何文件${dryRunText}`));
    return;
  }

  const removeSpinner = ora().start("正在删除文件夹......\n");
  const removeErrors = await removeFileOrDir(foundDirs);

  if (removeErrors.length > 0) {
    removeSpinner.warn(`Some directories failed to delete, failed count: ${removeErrors.length}`);
    for (const removeError of removeErrors) {
      const message =
        removeError.error instanceof Error
          ? removeError.error.message
          : String(removeError.error);
      console.log(chalk.yellow(`Failed to delete: ${removeError.path} — ${message}`));
    }
    throw new Error(
      `Failed to delete: ${removeErrors.length} node_modules directories could not be removed, see logs above for details`
    );
  }

  const releasedText = withSize ? `，已释放约 ${formatSize(totalSize)}` : "";
  removeSpinner.succeed(`删除完成${releasedText}`);
}
