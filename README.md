# nodem-clean

> 一个用于递归删除指定目录下所有 `node_modules` 文件夹的命令行工具

[![npm version](https://img.shields.io/npm/v/nodem-clean.svg)](https://www.npmjs.com/package/nodem-clean)
[![npm downloads](https://img.shields.io/npm/dm/nodem-clean.svg)](https://www.npmjs.com/package/nodem-clean)
[![license](https://img.shields.io/npm/l/nodem-clean.svg)](./LICENSE)

- 📦 [Npm 包地址](https://www.npmjs.com/package/nodem-clean)
- 💻 [Github 源码](https://github.com/ruanbw/nodem-clean)

## 简介

随着项目越来越多，散落在各处的 `node_modules` 会悄悄占用大量磁盘空间，手动一个个查找删除既繁琐又容易出错。`nodem-clean` 可以递归扫描指定目录，一次性清理掉其中所有的 `node_modules` 文件夹，帮你快速释放磁盘空间。

## 特性

- 🔍 递归扫描指定目录下的所有 `node_modules`
- 📂 支持指定任意路径，默认清理当前目录
- 🔒 自动跳过符号链接（symlink），避免跨目录误删
- 🛡️ 禁止直接扫描根目录（如 `/`、`C:\`），降低高风险误操作
- ⚡ 基于 TypeScript 开发，使用简单

## 安装

全局安装：

```bash
# npm
npm install -g nodem-clean

# pnpm
pnpm add -g nodem-clean

# yarn
yarn global add nodem-clean
```

或者无需安装，直接通过 `npx` 运行：

```bash
npx nodem-clean k
```

## 快速开始

清理当前目录下的所有 `node_modules`：

```bash
nodem-clean k
```

## 使用

命令结构：

```bash
nodem-clean <command> [options]
```

常用示例：

```bash
# 删除当前目录下的 node_modules（. 表示当前目录）
nodem-clean killer .

# 简写：不加路径默认为当前目录
nodem-clean k

# 指定路径
nodem-clean k --path D:projectstest

# 指定路径（简写）
nodem-clean k -p D:projectstest
```

### 命令与参数

| 命令 / 参数      | 简写 | 说明              | 默认值      |
| ---------------- | ---- | ----------------- | ----------- |
| `killer`         | `k`  | 执行删除操作      | —           |
| `--path <dir>`   | `-p` | 指定要扫描的目录  | 当前目录 `.` |

> 提示：`killer` 与 `k` 完全等价；不传路径或传 `.` 都表示当前目录。

## 行为说明

- 为避免跨目录误删，工具默认跳过符号链接（symlink）及其指向内容。
- 为避免高风险误操作，工具不允许直接扫描根目录（例如 `/`、`C:\`）。

## 常见问题（FAQ）

**删除后还能恢复吗？**
不能。`node_modules` 会被直接删除，请确认目录无误后再执行。

**删除后如何恢复依赖？**
进入对应项目目录重新执行 `npm install` / `pnpm install` / `yarn` 即可。

## 开发

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

本地调试可使用 `npm link` 将命令链接到全局后进行测试。

## 贡献

欢迎提交 Issue 和 Pull Request。如有功能建议或 Bug 反馈，请前往 [Issues](https://github.com/ruanbw/nodem-clean/issues) 页面。

## 许可证

[MIT](./LICENSE)
