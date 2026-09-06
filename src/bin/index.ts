#!/usr/bin/env node

import { Command } from "commander";
import { killerAction } from "../lib/index.js";
import pkg from "../../package.json" with { type: "json" };

const program = new Command();

program
  .name("nodem-clean")
  .description("CLI for finding and cleaning up node_modules directories")
  .version(pkg.version);

program
  .command("killer")
  .alias("k")
  .description("Delete all node_modules folders under a specified directory")
  .option("-p, --path <path>", "Target directory", ".")
  .option("--dry-run", "List directories that would be deleted without deleting", false)
  .option("--size", "Calculate and show each directory's size (skipped by default for speed)", false)
  .action(async (args: { path: string; dryRun: boolean; size: boolean }) => {
    try {
      await killerAction(args.path, { dryRun: args.dryRun, size: args.size });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Execution failed: ${message}`);
      process.exitCode = 1;
    }
  });

program.parse();
