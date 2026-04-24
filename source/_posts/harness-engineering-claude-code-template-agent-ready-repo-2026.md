---
title: 用 Harness Engineering 打造 agent-ready repo：从 Claude Code template 到可验证的 AI coding workflow
date: 2026-04-05 20:30:00
categories:
  - 学习记录
  - 工具
tags:
  - AI
  - Agent
  - 工程化
  - Claude Code
cover: /images/covers/cover-05.jpg
comments: false
sticky: false
mermaid: false
copyright:
sponsor:
---

## 这篇文章想解决什么问题

最近越来越多团队在做 AI 开发时会遇到一个共同问题：

- 会用模型
- 会写 prompt
- 也能让 agent 改代码

但结果仍然不稳定。

同样一个需求，今天跑得通，明天就偏；同一个仓库，不同人调用 agent 产出的质量差异非常大。  
这时候问题通常不在“模型不够强”，而在仓库还不是 **agent-ready repo**。

这也是 **Harness Engineering** 要解决的核心：  
把代码仓库从“给人看”升级为“人和 agent 都能稳定执行”。

## 一、从普通 ChatBox 到 AI Agent

AI 从普通 chatBox 变成 AI Agent，本质上是从“只会对话”变成“会感知、会调用工具、会记忆、会执行任务”。

普通 chatBox 通常只有这一层：

用户输入 -> 大模型生成回复

例如你问“今天东京天气怎么样”，它只能基于训练数据回答，或者直接说无法获取实时信息。

而 AI Agent 的链路会变成：

用户输入 -> 判断意图 -> 调用工具 -> 获取结果 -> 继续推理 -> 输出最终答案

例如用户说：

“帮我查东京明天会不会下雨，如果下雨就提醒我带伞”

Agent 会按步骤执行：

1. 调用天气接口
2. 读取天气结果
3. 判断是否下雨
4. 输出建议“明天有雨，建议带伞”

所以 Agent 的核心不只是大模型，而是系统协作：

- 大模型负责理解和推理
- 工具负责获取真实世界数据
- 工作流负责控制执行步骤
- 记忆负责保存长期信息
- 知识库负责提供企业或私有数据

## 二、知识库与 RAG：原理并不复杂，但非常关键

知识库可以理解为：把文档切碎，再把文本变成向量并可检索。

常见数据来源包括：

- 产品文档
- 公司制度
- FAQ
- API 文档
- PDF、Word、Markdown

一个典型流程如下。

1. 文档切片：把长文档拆成小段，例如每段 300~500 字
2. 向量化：用 embedding 模型把每段文本转成向量
3. 入库：存入向量数据库
4. 检索：用户问题也向量化，召回语义最接近片段
5. 生成：把召回片段交给大模型生成回答

这套流程通常叫 RAG（Retrieval-Augmented Generation）：

用户问题 -> 检索知识库 -> 找到相关片段 -> 片段喂给大模型 -> 输出回答

向量数据库常见选择：

- Pinecone
- Milvus
- Weaviate
- Qdrant

它的核心优势是“语义检索”而不是“关键词匹配”。  
例如用户问“为什么退款这么久”，即使文档里写的是“退款需要 7 个工作日”，也能因为语义接近而被召回。

## 三、知识库优化：重点不在盲目换大模型

RAG 效果优化，通常优先看这些环节：

- 文档切片是否合理
- embedding 模型是否匹配业务语料
- 召回策略是否准确
- rerank 是否做过
- Prompt 是否限制模型胡编
- 是否有权限隔离
- 是否保留上下文记忆

一个常见且实用的参数组合是：

- 切片大小 300~500 字
- overlap 50~100 字
- 先召回 top10
- rerank 后取 top3
- 再交给大模型回答

切片太大，检索会不精准；切片太小，又可能丢失上下文。

## 四、再往上：多 Agent 协作与编排

Agent 再往上发展，就是多 Agent 协作。  
一个 Agent 不再包办全部任务，而是按角色分工：

- 一个负责搜索
- 一个负责写代码
- 一个负责测试
- 一个负责总结

你看到的 orchestrator 类项目，本质上就是把多个 Agent 串成工作流，而不是让单一模型一直聊天。

## 五、前端工程师会越来越常接触什么

如果你做前端，后续高频会接触这些能力模块：

- 聊天 UI
- 消息流式输出
- 多轮上下文管理
- RAG 知识库接入
- Tool Calling / Function Calling
- MCP
- Agent 工作流
- 向量数据库
- Prompt Engineering
- 多 Agent 编排

## 六、什么是 Harness Engineering

可以把 Harness Engineering 理解为一套面向 AI 协作的软件工程方法：

- 用明确结构组织上下文
- 用统一文档定义事实来源
- 用约束和校验保证结果可靠
- 用追踪链路保证可回溯

一句话总结就是：  
让 AI coding workflow 不靠运气，而靠工程系统本身。

## 七、为什么需要 Claude Code template

很多团队让 agent 直接读整个仓库，然后“自由发挥”。  
短期看很快，长期会出现两个问题：

- agent 对项目事实理解不一致
- 输出难以复查，变更风险高

这时你需要一个 **Claude Code template**，提前告诉 agent：

- 哪些文档是主源
- 哪些约束必须遵守
- 哪些检查必须通过
- 哪些目录允许改动

模板不是为了限制创造力，而是为了减少不确定性，让协作可复制。

## 八、agent-ready repo 的最小结构

一个可落地的 **agent-ready repo**，建议至少有以下层次：

1. `docs/`：作为 **canonical docs**（唯一可信事实源）  
2. `specs/`：功能规格与验收标准（**specs**）  
3. `contracts/`：接口、Schema、事件约定（**contracts**）  
4. `checks/`：测试、lint、策略门禁（**verification**）  
5. `traces/`：执行记录、变更证据、问题链路（**traces**）

这 5 层建立后，AI coding workflow 才有稳定运行的地基。

## 九、canonical docs：先统一事实，再追求速度

很多返工来自“事实不一致”：

- PRD 写了 A，接口文档还是 B
- README 是旧流程，代码已是新流程
- 口头约定没有固化

所以 **canonical docs** 的目标很明确：  
为 agent 提供统一“真相来源”，避免在冲突信息里猜测。

实践建议：

- 为关键域建立单一文档入口
- 在变更流程中强制同步文档
- 在模板中明确“冲突时以谁为准”

## 十、specs 和 contracts：把“需求”变成“可执行约束”

在 Harness Engineering 里，**specs** 和 **contracts** 是核心连接件：

- specs 解决“要做什么、做到什么程度”
- contracts 解决“系统如何互相对接”

它们能直接提升 agent 输出质量，因为 agent 不再只根据自然语言猜意图，而是根据结构化约束做实现。

## 十一、verification：没有校验的 AI coding workflow 不可上线

如果只有生成，没有 **verification**，AI 编码很容易把问题后移到联调和上线阶段。

建议把 verification 设为默认门禁：

- 单元测试和集成测试
- 类型检查和 lint
- API 合约校验
- 关键路径 smoke test

当 verification 变成流程默认动作，agent 产出才具备交付价值。

## 十二、traces：可追溯是团队协作的保险丝

AI 协作中最怕的是“改了什么、为什么改、依据是什么”说不清。  
这就需要 **traces**：

- 每次任务的输入上下文
- 关键决策依据
- 变更结果与校验输出
- 回归或失败时的定位线索

traces 不只是审计材料，它能直接减少排障成本。

## 十三、Superpowers：结构化仓库带来的复利

当仓库具备 Harness Engineering 的结构后，AI 团队会出现明显 **Superpowers**：

- 新成员更快上手
- agent 任务成功率更稳定
- 变更风险更可控
- 评审沟通成本降低
- 经验可以沉淀并复用

这就是“工具能力”变成“组织能力”的关键一步。

## 十四、GStack 视角：从点工具到系统能力

用 **GStack** 的视角看，模型只是其中一个环节。  
真正决定产出上限的，是这些能力是否串成系统：

- canonical docs
- specs
- contracts
- verification
- traces

当这些环节被打通，AI coding workflow 才会从“偶尔高光”变成“持续可交付”。

## 结语

如果你正在推进团队 AI 落地，优先级建议是：

1. 先把仓库做成 agent-ready repo  
2. 再完善 Claude Code template  
3. 最后持续强化 verification 和 traces

真正的效率不是“让 agent 写得更快”，而是让结果更稳、更准、更可复用。  
这就是 Harness Engineering 的价值所在。
