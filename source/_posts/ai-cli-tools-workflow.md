---
title: AI 编程工具工作流：Claude / Gemini / Codex + CC-Switch + OpenCode
date: 2026-02-12 11:00:00
categories: 工具
tags:
  - 工程化
  - 效率
  - AI
  - CLI
cover: /images/covers/cover-05.jpg
comments: false
---

## 这篇文章解决什么问题

当你同时在用 Claude、Gemini、Codex 和 OpenCode 时，最常见的问题不是“没有工具”，而是：

- 每个工具的鉴权方式不一样
- 模型切换成本高
- 在项目里复用同一套流程比较难

这篇文章记录一套可落地的做法：用 CC-Switch 做统一模型切换入口，再配合各 CLI 完成日常开发。

## 一、CC-Switch：统一入口

CC-Switch 的核心价值是“统一管理模型与供应商配置”，减少在不同 CLI 间来回改配置的成本。

建议把它当作模型路由层：

- 统一保存 provider / model 配置
- 统一做模型切换
- 上层工具按同一入口调用

## 二、Claude CLI 的使用

常见使用方式：

```bash
claude
```

建议先完成两件事：

- 先确认已完成账号鉴权
- 在项目目录启动，让上下文对齐当前仓库

日常建议：

- 大改动前先让它输出技术方案
- 多文件改动时让它给出“改动清单 + 风险点 + 验证命令”

## 三、Codex CLI 的使用

在仓库根目录运行：

```bash
codex
```

建议使用习惯：

- 先描述目标和验收标准（功能、文件范围、测试命令）
- 明确是否允许直接改代码
- 每次改动后要求执行构建或测试命令

这样做的好处是：输出更稳定、修改范围可控、回滚成本低。

## 四、Gemini CLI 的使用

Gemini 适合做：

- 方案对比
- 大段文本重写
- 代码解释和边界条件补全

建议和 Codex/Claude 的分工：

- Gemini 先做方案发散
- Codex 或 Claude 负责落地改动与验证

## 五、OpenCode 的使用

OpenCode 可以作为另一个可选入口，重点是和 CC-Switch 协同：

- 在 OpenCode 里对接 CC-Switch 提供的模型配置
- 启动后先看可用模型列表（如 `/models`）
- 固定一个默认模型，减少切换抖动

## 六、一套可复用的日常流程

1. 在 CC-Switch 里选好本次任务模型。
2. 用 Gemini 做方案发散，定一个最小改动路径。
3. 用 Codex 或 Claude 在仓库里实施改动。
4. 执行构建/测试命令验证结果。
5. 记录复盘：哪种模型在这个任务上最稳。

## 七、我在实践里的取舍

- 需求不清晰时，先用 Gemini 拿多个思路。
- 需要“直接改代码并跑命令”时，用 Codex 或 Claude。
- 涉及多模型切换时，用 CC-Switch 先统一入口再开工。
- OpenCode 作为补充入口，主要用于快速切换和对比。

## 参考文档

- [SouImagery 指南](https://docs.souimagery.fun/guide/)
- [CC-Switch 文档](https://docs.packyapi.com/docs/ccswitch/)
