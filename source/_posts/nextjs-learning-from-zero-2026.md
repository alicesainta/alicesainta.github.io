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

## Next.js 是什么

Next.js 是一个基于 React 的全栈框架，适合做内容站、管理后台和中大型前端应用。

它的核心能力之一是支持多种渲染方式，最常见的是：

- 静态生成（SSG）：在构建阶段生成 HTML，适合更新频率不高、可缓存的页面。
- 服务端渲染（SSR）：在请求阶段动态生成 HTML，适合需要实时数据或个性化输出的页面。

在实际项目里，通常会按页面职责混合使用 SSG 和 SSR，而不是全站只选一种。

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

## 服务器端渲染（SSR）和非服务器端渲染（CSR）

先把两个概念分清：

- SSR（Server-Side Rendering）：每次请求到来时，由服务端生成 HTML，再返回给浏览器。
- CSR（Client-Side Rendering）：先返回基础 HTML 和 JS，由浏览器执行 JS 后再渲染页面内容。

核心差异可以从四个角度看：

- 首屏体验：SSR 通常更快看到可读内容；CSR 更依赖 JS 下载和执行。
- SEO：SSR 对搜索引擎更友好；CSR 需要额外处理爬虫可见性。
- 交互启动：CSR 在交互型页面更灵活；SSR 需要配合客户端水合。
- 资源压力：SSR 增加服务端渲染压力；CSR 把更多压力放在客户端。

在 Next.js 里的实际选择：

- 内容展示型页面（文档、博客、营销页）优先考虑 SSR/Server Component。
- 强交互后台页（表格筛选、复杂表单）可以增加 CSR/Client Component 比重。
- 一般不是二选一，而是按页面职责混合使用。

补一条关键概念：水合（Hydration）

- 水合指的是：服务端先返回可读 HTML，浏览器下载并执行 JS 后，把这份静态内容“接管”为可交互页面。
- 常见问题是 hydration mismatch（服务端输出和客户端首次渲染不一致），会导致警告甚至界面闪动。
- 实践上要尽量保证首屏一致性，避免在首屏渲染里直接依赖 `window`、随机数、当前时间这类客户端不稳定值。

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
