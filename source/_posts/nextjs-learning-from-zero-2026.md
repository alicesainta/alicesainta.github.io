---
title: Next.js 学习记录：从零开始（2026）
date: 2026-03-02 11:30:00
categories: 学习记录
tags:
  - Next.js
  - React
  - 前端
  - 学习记录
cover: /images/covers/cover-02.jpg
comments: false
---

## 为什么开始学 Next.js

2026 年重新系统学习 Next.js，目标不是只会跑模板，而是能独立完成一套可部署、可维护的全栈前端项目。

## 学习目标（第一阶段）

- 搞清楚 App Router 的页面和布局组织方式
- 能区分 Server Component 和 Client Component 的使用边界
- 掌握基础数据获取与缓存策略
- 完成一个可上线的小项目

## 第 0 步：环境准备

- Node.js（建议 LTS）
- pnpm（包管理工具）
- VS Code + ESLint + Prettier

初始化项目：

```bash
pnpm create next-app@latest nextjs-2026-notes
cd nextjs-2026-notes
pnpm dev
```

## 第 1 步：路由与页面结构（App Router）

重点理解目录：

- `app/page.tsx`：首页
- `app/layout.tsx`：全局布局
- `app/blog/page.tsx`：`/blog` 页面
- `app/blog/[slug]/page.tsx`：动态路由

当前结论：

- 先把页面拆分清楚再写逻辑，后期维护成本更低
- 动态路由是内容型站点的基础能力

## 第 2 步：数据获取与渲染模式

需要优先区分三件事：

- 什么时候用 Server Component
- 什么时候切 Client Component（`\"use client\"`）
- `fetch` 的缓存行为（默认缓存、`no-store`、`revalidate`）

学习任务：

- 用 Server Component 拉取接口数据并渲染列表
- 在 Client Component 实现交互（筛选、搜索）
- 给页面加基础加载态和错误态

## 第 3 步：状态管理与表单

短期方案：

- 局部状态先用 `useState`
- 跨组件再考虑 Context 或 Zustand
- 表单先用 React Hook Form + Zod（便于校验）

## 第 4 步：性能与工程化

必做清单：

- 使用 `next/image` 优化图片
- 使用动态导入减少首屏体积
- 识别并消除不必要的 Client Component
- 用 Lighthouse 做一次基线检测

## 第 5 步：部署与上线

部署优先顺序：

- 首选 Vercel（上手快）
- 有自托管需求再考虑 Docker + Node 运行时

上线前检查：

- 环境变量是否区分开发/生产
- SEO 基础信息（title、description、OG）
- 错误监控和日志是否可追踪

## 本周复盘（Week 1）

- 已完成：项目初始化、App Router 基础认知
- 待完成：数据获取 + 缓存策略实操
- 下周目标：做一个“文章列表 + 文章详情”最小项目

## 后续更新计划

这篇文章会持续更新，后续补充：

- Server Actions 实战
- 鉴权（NextAuth / Clerk）接入记录
- 与后端 API 协作的规范模板
