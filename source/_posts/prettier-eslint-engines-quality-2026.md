---
title: Prettier、ESLint、质量规则与 engines 版本锁定
date: 2026-03-04 10:30:00
categories: 学习记录
tags:
  - Prettier
  - ESLint
  - Node.js
  - package.json
  - 工程化
cover: /images/covers/cover-03.jpg
comments: false
---

> 工程化常见误区：把 Prettier 和 ESLint 混在一起、规则互相打架、团队环境版本不一致。本文给一套可执行的最小方案。

## 一、先定边界：Prettier 和 ESLint 分工不同

明确分工后，配置会简单很多：

- Prettier：只负责代码格式（空格、换行、分号、引号等）。
- ESLint：负责代码质量与潜在 bug（未使用变量、危险写法、React Hooks 依赖等）。

如果把“格式”也交给 ESLint，常见结果是规则冲突、开发体验差、CI 噪音大。

## 二、为什么会出现“质量规则重叠”

重叠通常来自两类问题：

- ESLint 同时启用了格式化类规则。
- Prettier 与 ESLint 对同一语法点有不同偏好。

最小解法：

- 使用 `eslint-config-prettier` 关闭与 Prettier 冲突的 ESLint 规则。
- 让 Prettier 成为唯一格式化入口。

## 三、一套可维护的执行顺序

推荐顺序：

1. `prettier --check`（或 `--write`）。
2. `eslint .`
3. `test`
4. `build`

这样做的好处：

- 先处理格式，减少 ESLint 输出噪音。
- 质量问题单独暴露，定位更清晰。
- 测试和构建结果更可靠。

## 四、规则分层：error / warn / off

不要一上来“全开 error”。先保证团队可执行，再逐步收紧。

建议分层：

- `error`：会导致 bug、会破坏可维护性的规则。
- `warn`：建议优化但不阻断合并的规则。
- `off`：短期内不适合项目现状的规则。

质量门禁策略：

- CI 仅阻断 `error`。
- `warn` 通过每周修复或重构任务逐步清理。

## 五、为什么要锁工程环境版本

“我本地能跑、你本地报错”多数不是业务问题，而是环境漂移。

常见漂移来源：

- Node 版本不一致。
- 包管理器版本不一致。
- 锁文件被非预期工具更新。

## 六、`package.json` 里的 engines 怎么写

推荐在 `package.json` 明确声明：

```json
{
  "engines": {
    "node": ">=20 <21",
    "pnpm": ">=10 <11"
  },
  "packageManager": "pnpm@10.5.0"
}
```

说明：

- `engines` 用来声明运行边界，避免低版本环境误装误跑。
- `packageManager` 固定团队使用的包管理器与主版本。
- CI 里配合 `pnpm install --frozen-lockfile`，确保依赖解析一致。

## 七、可直接落地的项目约定

建议你在团队里固定这几条：

- 统一 Node 主版本（如 20）。
- 统一包管理器（如 pnpm）。
- PR 必须通过：格式检查、Lint、测试、构建。
- 禁止手动改锁文件中的无关内容。

## 八、常见反模式

- 一个仓库同时允许 npm/yarn/pnpm 混用。
- 本地自动修复通过，但 CI 没有同样步骤。
- ESLint 规则太激进，导致团队大量 `eslint-disable`。
- Prettier 配置散落多个文件，且互相冲突。
