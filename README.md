# nodem-clean

[English](./README.md) | [简体中文](./README.zh-CN.md)

> A CLI tool that recursively deletes all `node_modules` folders under a given directory.

[![npm version](https://img.shields.io/npm/v/nodem-clean.svg)](https://www.npmjs.com/package/nodem-clean)
[![npm downloads](https://img.shields.io/npm/dm/nodem-clean.svg)](https://www.npmjs.com/package/nodem-clean)
[![license](https://img.shields.io/npm/l/nodem-clean.svg)](./LICENSE)

- 📦 [npm package](https://www.npmjs.com/package/nodem-clean)
- 💻 [GitHub repository](https://github.com/ruanbw/nodem-clean)

## Introduction

As projects pile up, `node_modules` folders scattered across your disk quietly consume gigabytes of space, and hunting them down by hand is tedious and error-prone. `nodem-clean` recursively scans a target directory and removes every `node_modules` folder it finds in one shot.

## Features

- 🔍 Recursively finds every `node_modules` under the target directory
- 📂 Accepts any path; defaults to the current directory
- 🔒 Automatically skips symlinks to avoid cross-directory accidents
- 🛡️ Refuses to scan a filesystem root (e.g. `/`, `C:\`), reducing high-risk mistakes
- 🧪 `--dry-run` mode to preview before deleting
- 📏 Optional `--size` calculation per directory
- ⚡ Written in TypeScript, simple to use

## Installation

Install globally:

```bash
# npm
npm install -g nodem-clean

# pnpm
pnpm add -g nodem-clean

# yarn
yarn global add nodem-clean
```

Or run it without installing, via `npx`:

```bash
npx nodem-clean k
```

## Quick Start

Clean all `node_modules` under the current directory:

```bash
nodem-clean k
```

## Usage

Command structure:

```bash
nodem-clean <command> [options]
```

Common examples:

```bash
# Delete node_modules under the current directory ("." means cwd)
nodem-clean killer .

# Shorthand: no path defaults to the current directory
nodem-clean k

# Preview what would be deleted, without deleting
nodem-clean k --dry-run

# Show the size of each node_modules directory
nodem-clean k --size

# Target a specific path
nodem-clean k --path "D:\projects\test"

# Same, with the short flag
nodem-clean k -p "D:\projects\test"
```

### Commands & Options

| Command / Option   | Short | Description                                  | Default       |
| ------------------ | ----- | -------------------------------------------- | ------------- |
| `killer`           | `k`   | Perform the deletion                         | —             |
| `--path <dir>`     | `-p`  | Directory to scan                            | current dir `.` |
| `--dry-run`        | —     | List what would be deleted, without deleting | `false`       |
| `--size`           | —     | Compute and show each directory's size       | `false`       |

> Tip: `killer` and `k` are fully equivalent; passing no path or `.` both mean the current directory.

## Behavior Notes

- To prevent cross-directory accidents, symlinks and their targets are skipped.
- To prevent high-risk mistakes, scanning a filesystem root (e.g. `/`, `C:\`) is not allowed.

## FAQ

**Can deleted folders be recovered?**
No. `node_modules` folders are deleted directly, not moved to the trash. Double-check the target path first — or run with `--dry-run` to preview.

**How do I restore dependencies afterwards?**
Run `npm install` / `pnpm install` / `yarn` inside each affected project.

## Development

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

For local debugging, use `npm link` to link the command globally, then test it.

## Contributing

Issues and pull requests are welcome. For feature suggestions or bug reports, please head to the [Issues](https://github.com/ruanbw/nodem-clean/issues) page.

## License

[MIT](./LICENSE)
