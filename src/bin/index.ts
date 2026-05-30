#!/usr/bin/env node

import { Command } from "commander";
import { killerAction } from "../lib";
import pkg from "../../package.json";

const program = new Command();

program
  .name("nodem-clean")
  .description("删除指定目录下的所有 node_modules 文件夹")
  .version(pkg.version);

program
  .command("killer")
  .alias("k")
  .description("删除指定目录下的所有 node_modules 文件夹")
  .option("-p, --path <path>", "指定目录", ".")
  .option("--dry-run", "只列出将被删除的目录，不实际删除", false)
  .option("--size", "计算并显示各目录大小（默认跳过以加快速度）", false)
  .action(async (args: { path: string; dryRun: boolean; size: boolean }) => {
    try {
      await killerAction(args.path, { dryRun: args.dryRun, size: args.size });
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      console.error(`执行失败: ${message}`);
      process.exitCode = 1;
    }
  });

program.parse();
