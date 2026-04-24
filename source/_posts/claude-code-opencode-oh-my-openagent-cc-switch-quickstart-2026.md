---
title: Claude Code、OpenCode、Oh My OpenAgent、CC-Switch 简单上手
date: 2026-03-14 22:30:00
categories:
  - 工具
  - 学习记录
tags:
  - AI
  - CLI
  - 工程化
  - 效率
cover: /images/covers/cover-03.jpg
comments: false
sticky: false
mermaid: false
copyright:
sponsor:
---

## 这篇文章写给谁

如果你最近在折腾 AI 编程工具，大概率会同时看到这几个名字：

- `Claude Code`
- `OpenCode`
- `Oh My OpenAgent`
- `CC-Switch`

名字很多，但它们不是同一种东西。

- 它们分别是干什么的
- 最基础怎么安装
- 最常用怎么启动
- 新手应该怎么把它们串起来用

## 一、先用一句话理解这四个工具

先别急着装，先把定位分清楚。

### 1. Claude Code 是什么

`Claude Code` 是 Anthropic 官方推出的终端编程助手。

你可以把它理解成：

- 在终端里和 Claude 协作写代码
- 能看当前仓库上下文
- 适合做修改、重构、排查问题、补测试

如果你本来就习惯在命令行里工作，那它上手非常直接。

### 2. OpenCode 是什么

`OpenCode` 是一个开源的 AI 编程助手，支持多种模型和多种提供商。

你可以把它理解成：

- 一个更开放的终端 agent
- 不强绑定某一家模型厂商
- 更适合喜欢折腾配置、模型切换和扩展能力的人

### 3. Oh My OpenAgent 是什么

`Oh My OpenAgent` 本质上不是一个独立 CLI，而是一套基于 `OpenCode` 的增强层。

它会给 `OpenCode` 加上一整套更激进的 agent 工作流，比如：

- 更强的任务分工
- 更细的配置能力
- 更偏“自动化执行”的工作方式

需要注意一件事：

- 截至 `2026-03-14`，官方站点名称已经是 `Oh My OpenAgent`
- 但安装命令和部分仓库名仍然使用 `oh-my-opencode`

所以你看到这两个名字，不一定是两个项目，很多时候说的是同一套东西的不同命名阶段。

### 4. CC-Switch 是什么

`CC-Switch` 更像一个外围配置工具。

它主要解决的是：

- 在多个 CLI 之间切换供应商配置
- 统一管理 API 配置
- 少手动改配置文件

如果你会在 `Claude Code`、`Codex`、`Gemini CLI` 之间来回切换，它会明显省事。

从文档看，它现在既有桌面版，也有单独的 `CC-Switch CLI`。

如果你是普通用户，优先用桌面版通常更省心；
如果你在服务器或终端环境里工作比较多，再考虑 CLI 版。

## 二、Claude Code 怎么快速开始

官方文档里最常见的安装方式是：

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，在项目目录里启动：

```bash
claude
```

第一次启动通常会进入登录或鉴权流程。

几个最常见的命令：

```bash
claude
claude --help
claude doctor
claude update
```

新手最简单的使用方式，不要一上来就让它“随便改”，而是先这样说：

```text
先看一下这个仓库的结构，再告诉我这个需求最小改动应该怎么做。
```

然后再继续：

```text
按你的方案直接修改代码，并告诉我改了哪些文件、怎么验证。
```

这样做的好处是：

- 不容易一开口就改偏
- 先拿到方案，再决定要不要动手
- 更适合真实项目

## 三、OpenCode 怎么快速开始

OpenCode 官方给出的安装方式很多，最直接的是安装脚本：

```bash
curl -fsSL https://opencode.ai/install | bash
```

如果你更习惯 Node.js，也可以：

```bash
npm install -g opencode-ai
```

安装后，常见流程是：

```bash
opencode auth login
opencode
```

进入 TUI 后，官方现在也推荐直接用：

```text
/connect
```

来连接 `opencode` 自带的 provider，或者切换到其他 provider。

如果你只是想让它一次性做一件事，也可以用：

```bash
opencode run "先总结这个仓库，再给我一个重构建议清单"
```

第一次进入某个项目后，建议再执行一次：

```text
/init
```

这样它会先分析当前仓库，并生成项目级的 `AGENTS.md`。

OpenCode 比较适合下面这类场景：

- 想自由换模型
- 想在同一个工具里接不同 provider
- 想保留更强的可配置性

如果你是第一次用，建议不要一开始就折腾高级配置，先把下面三件事跑通：

1. 能正常安装。
2. 能完成登录或 provider 配置。
3. 能在仓库目录成功启动 `opencode`。

## 四、Oh My OpenAgent 怎么开始用

这个工具的核心前提是：

- 你最好已经先装好 `OpenCode`

常见安装方式是：

```bash
bunx oh-my-opencode install
```

如果本机没有 `bunx`，也可以试：

```bash
npx oh-my-opencode install
```

安装完成后，你日常通常还是从 `OpenCode` 入口进入：

```bash
opencode
```

它和直接裸用 OpenCode 的区别，不是“命令不一样”，而是：

- agent 编排更重
- 默认工作流更激进
- 更适合复杂任务、多步骤任务、长流程任务

如果你只是想先体验，不用急着配很多文件。

先知道两个点就够了：

- 项目级配置可以放在 `.opencode/oh-my-opencode.json`
- 用户级配置可以放在 `~/.config/opencode/oh-my-opencode.json`

对新手来说，最简单的理解方式是：

- `OpenCode` 是底座
- `Oh My OpenAgent` 是增强插件和工作流层

## 五、CC-Switch 最适合怎么用

`CC-Switch` 最适合的使用姿势，不是把它当成“主力写代码工具”，而是把它当成：

- 配置中心
- 切换面板
- 统一入口

它比较适合这类人：

- 同时用多个 AI CLI
- 经常切换不同 API 提供商
- 不想每次手动改配置文件

对于新手来说，可以把它理解成一句话：

> 先用它把配置切好，再去开 `Claude Code` 或其他 CLI 干活。

如果你只长期固定使用一个官方入口，其实未必非要上 `CC-Switch`。

但如果你已经开始多工具并行，它就会比手改配置稳定很多。

## 六、新手最推荐的一套使用顺序

如果你现在是第一次接触这几个工具，我更建议按这个顺序来：

### 路线一：想先稳定上手

1. 先装 `Claude Code`
2. 在一个小项目里试一次“分析 -> 修改 -> 验证”
3. 熟悉终端协作节奏

这条路的优点是：

- 官方工具
- 心智负担小
- 上手快

### 路线二：想要更开放的模型选择

1. 安装 `OpenCode`
2. 配好登录或 provider
3. 先直接用原生 `OpenCode`
4. 再安装 `Oh My OpenAgent`

这条路更适合：

- 喜欢折腾模型
- 希望更强的 agent 工作流
- 想把控制权拿在自己手里

### 路线三：你已经多工具并用

如果你已经同时在用多个 CLI，就可以把 `CC-Switch` 加进来：

1. 用 `CC-Switch` 管配置
2. 用 `Claude Code` 做直接开发
3. 用 `OpenCode + Oh My OpenAgent` 做更复杂的任务

## 七、一个最实用的组合思路

如果你问我，新手最容易落地的组合是什么，我会这样配：

- 日常小改动：`Claude Code`
- 想对比不同模型：`OpenCode`
- 想要更强的自动化 agent 工作流：`OpenCode + Oh My OpenAgent`
- 想统一切换配置：`CC-Switch`

这个组合的好处不是“工具越多越强”，而是：

- 每个工具负责的事情更清楚
- 出问题时更容易定位
- 迁移成本也更低

## 八、最后给新手的三个建议

### 1. 不要一开始就追求全家桶

先把一个工具跑通，比一下子装四个更重要。

### 2. 先能稳定完成一个小任务

比如：

- 解释一个模块
- 改一个小 bug
- 补一个测试
- 优化一个函数

先把这种闭环做出来，再扩展到复杂工作流。

### 3. 配置工具和写代码工具要分开理解

很多人一开始会混淆：

- 谁负责“执行任务”
- 谁负责“切换配置”
- 谁负责“增强工作流”

分清之后就不会乱：

- `Claude Code` / `OpenCode` 负责干活
- `Oh My OpenAgent` 负责增强 `OpenCode`
- `CC-Switch` 负责配置管理

## 参考链接

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/getting-started)
- [Claude Code Quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart)
- [OpenCode 官方文档](https://opencode.ai/docs/)
- [OpenCode 官网](https://open-code.dev/)
- [Oh My OpenAgent 官网](https://ohmyopenagent.com/)
- [Oh My OpenAgent 文档](https://ohmyopenagent.com/zh/docs)
- [Oh My OpenCode GitHub](https://github.com/code-yeongyu/oh-my-opencode)
- [CC-Switch 文档](https://docs.packyapi.com/docs/ccswitch/)
