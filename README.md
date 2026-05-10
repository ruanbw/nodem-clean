# nodem-clean

这是一个删除指定目录下所有 node_modules 的命令行工具

[Github 源码](https://github.com/1813967922/nodem-clean)

[Npm 包地址](https://www.npmjs.com/package/nodem-clean)

## 安装
```sh
npm install -g nodem-clean
```

## 使用

```sh
# 删除当前目录下的node_modules文件夹 . 为当前目录
nodem-clean killer .

# 简写:不加 . 默认为当前目录
nodem-clean k

# 指定路径
nodem-clean k --path D:\\projects\\test

# 指定路径简写
nodem-clean k -p D:\\projects\\test
```

## 行为说明

- 为避免跨目录误删，工具默认跳过符号链接（symlink）及其指向内容。
- 为避免高风险误操作，工具不允许直接扫描根目录（例如 `/`、`C:\\`）。

## 开发

```sh
pnpm install
pnpm run typecheck
pnpm run build
```
