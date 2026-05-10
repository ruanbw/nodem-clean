#!/usr/bin/env node

import { Command } from "commander";
import { killerAction } from "../lib";

const program = new Command();

program
  .name("clearctl")
  .description("删除指定目录下的所有 node_modules 文件夹")
  .version("1.0.0");

program
  .command("killer")
  .alias("k")
  .description("删除指定目录下的所有 node_modules 文件夹")
  .option("-p, --path <path>", "指定目录", ".")
  .action(async (args: { path: string }) => {
    await killerAction(args.path);
  });

program.parse();
