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
  const searchSpinner = ora().start("Searching for node_modules directories...\n");
  await searchDir(newPath, "node_modules", foundDirs, withSize);

  if (foundDirs.length === 0) {
    searchSpinner.succeed("No node_modules directories found");
    return;
  }

  const totalSize = foundDirs.reduce((sum, dir) => sum + dir.size, 0);
  const totalSizeText = withSize ? `, total ${formatSize(totalSize)}` : "";

  searchSpinner.succeed(`Found ${foundDirs.length} node_modules director${foundDirs.length === 1 ? "y" : "ies"}${totalSizeText}`);

  for (const dir of foundDirs) {
    const sizeText = withSize && dir.size > 0 ? `  (${formatSize(dir.size)})` : "";
    console.log(chalk.blue(`  ${dir.path}${sizeText}`));
  }

  if (options.dryRun) {
    const dryRunText = withSize ? `. Would free about ${formatSize(totalSize)}` : ".";
    console.log(chalk.yellow(`\n[dry-run] No files were deleted${dryRunText}`));
    return;
  }

  const removeSpinner = ora().start("Deleting directories...\n");
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

  const releasedText = withSize ? `, freed about ${formatSize(totalSize)}` : "";
  removeSpinner.succeed(`Deletion complete${releasedText}`);
}
