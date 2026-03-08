---
title: Css面试相关
date: 2026-01-08 20:00:00
categories: 面试
tags:
  - CSS
  - 前端面试
  - 前端八股
cover: /images/covers/cover-08.jpg
comments: false
---

> 基于现有题库中的 CSS 条目整理。目标是形成可直接用于面试的结构化答案。

## 1. CSS 至少两种水平垂直居中方式

### 题目

CSS 如何实现水平垂直居中？至少说两种。

### 作答

常见可行方案可以按场景分类：

- `flex` 居中：父元素 `display: flex; justify-content: center; align-items: center;`
- `grid` 居中：父元素 `display: grid; place-items: center;`
- 绝对定位 + `transform`：子元素 `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);`
- 已知高度场景可用行高法：`line-height` 等于容器高度（仅适合单行文本）
- 定宽高元素可用 `margin: auto`：子元素绝对定位并设置 `inset: 0; margin: auto;`

### 追问延展

- 需要同时兼顾响应式和内容自适应时，优先选择 `flex` 或 `grid`
- `margin: 0 auto` 只能处理块级元素的水平居中，不直接解决垂直居中

## 2. Flex 布局核心概念

### 题目

说一下 Flex 布局。

### 作答

Flex 是一维布局模型，适合处理单行或单列的空间分配与对齐。  
核心点包括：

- 主轴与交叉轴
- 容器属性：`justify-content`、`align-items`、`flex-wrap`
- 项目属性：`flex-grow`、`flex-shrink`、`flex-basis`

### 追问延展

- 多行对齐使用 `align-content`，单行对齐使用 `align-items`
- `gap` 可直接控制子项间距，避免额外 margin 处理

## 3. `flex: 1` 的含义

### 题目

`flex: 1` 表示什么？

### 作答

`flex: 1` 是简写，等价于：

```css
flex-grow: 1;
flex-shrink: 1;
flex-basis: 0%;
```

表示项目可增长、可收缩，初始基准为 0%，会参与剩余空间分配。

### 追问延展

- `flex: auto` 等价于 `1 1 auto`，与 `flex: 1` 在 `flex-basis` 上有区别
- 实际布局差异常出现在子项内容宽度不一致时

## 4. 文本溢出显示省略号

### 题目

如何让文本溢出后显示省略号？

### 作答

单行省略常见写法：

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

多行省略常见写法（WebKit 方案）：

```css
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
```

### 追问延展

- 省略号生效通常依赖固定宽度或可计算宽度容器
- 多行截断兼容性需按项目浏览器支持策略评估

## 5. CSS 布局方式如何理解

### 题目

CSS 是怎么布局的？

### 作答

可以从演进角度理解布局方式：

- 普通文档流（Normal Flow）
- 浮动布局（Float）
- 定位布局（Position）
- 弹性布局（Flex）
- 网格布局（Grid）

现代项目通常以 Flex/Grid 为主，定位和浮动作为补充能力。

### 追问延展

- Flex 更适合一维布局，Grid 更适合二维布局
- 复杂页面可组合使用，例如外层 Grid、内层 Flex

## 6. `position` 的类型与特性

### 题目

`position` 有哪些类型？

### 作答

常见取值：

- `static`：默认定位，不受 `top/right/bottom/left` 影响
- `relative`：相对自身原位置偏移，仍保留原占位
- `absolute`：脱离文档流，相对最近的非 `static` 祖先定位
- `fixed`：相对视口定位，常用于悬浮元素
- `sticky`：在阈值范围内类似 `relative`，触发后类似 `fixed`

### 追问延展

- `absolute` 的定位参考系常是追问重点
- `sticky` 生效需要满足滚动容器与阈值条件

## 7. `transform` 与 `calc` 的使用

### 题目

说一下 `transform`、`calc` 的常见用途。

### 作答

- `transform`：用于平移、旋转、缩放等视觉变换，不会直接触发布局重排
- `calc()`：在 CSS 中进行运行时长度计算，便于混合单位（如 `%` 与 `px`）

### 追问延展

- 居中场景常见 `translate(-50%, -50%)`
- 宽度计算如 `width: calc(100% - 240px)`，适合侧边栏+内容区场景

## 8. `span` 宽高与标签嵌套问题

### 题目

`span` 如何设置宽高？`span` 里面能放 `p` 吗？

### 作答

- `span` 默认是行内元素，直接设置宽高通常不生效
- 可通过 `display: inline-block` 或 `display: block` 让宽高生效
- `p` 是块级元素，按 HTML 语义与内容模型，不建议放在 `span`（行内容器）内

### 追问延展

- 实际开发应优先保持语义正确，再通过 CSS 调整展示行为

## 9. `z-index` 的作用与层叠上下文

### 题目

`z-index` 怎么理解？

### 作答

`z-index` 用于控制同一层叠上下文中的堆叠顺序。  
数值越大不代表全局永远在最上层，前提是元素处在可比较的上下文中。

### 追问延展

- 某些属性会创建新的层叠上下文（如 `position` + `z-index`、`transform`、`opacity < 1`）
- 排查遮挡问题时要先确认是否进入了不同层叠上下文

## 10. `animation`、`transition`、`transform` 的区别

### 题目

CSS 中 `animation`、`transition`、`transform` 有什么区别？

### 作答

- `transform` 是“变形能力”，负责平移、旋转、缩放等视觉变化
- `transition` 是“状态过渡机制”，在属性变化时平滑过渡到目标状态
- `animation` 是“关键帧动画机制”，可定义多阶段、循环、方向、延迟等复杂动画

### 追问延展

- `transform` 通常与 `transition` 或 `animation` 组合使用
- 交互动效多用 `transition`，复杂连续动效多用 `@keyframes + animation`

## 11. 移动端样式适配

### 题目

怎么做移动端样式适配？

### 作答

核心是“视口正确 + 布局弹性 + 资源自适应”：

- 设置 viewport：`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
- 使用响应式布局：媒体查询、弹性单位（`rem`、`vw`、`vh`）
- 布局优先用 Flex/Grid，避免大量固定像素值
- 图片根据设备能力输出合适尺寸，减少不必要流量

### 追问延展

- 移动端优先（Mobile First）可减少样式覆盖复杂度
- 断点设计应围绕内容断裂点，而不是机械按设备型号

## 12. `inline-block` 间距问题

### 题目

相邻两个 `inline-block` 元素为什么会有间距？如何解决？

### 作答

原因是标签间的空白字符（空格、换行）会被当作文本节点渲染。  
常用解决方式：

- 去掉元素间空白字符
- 父元素设置 `font-size: 0`，子元素再恢复字体大小
- 改用 Flex 布局，直接规避 `inline-block` 空白问题

### 追问延展

- 在组件化场景下更推荐 Flex/Grid，维护成本更低

## 13. CSS Grid 网格布局基础

### 题目

说一下 CSS Grid 的基本概念和用法。

### 作答

Grid 是二维布局模型，可同时管理行与列。  
容器常见属性包括：

- `display: grid`
- `grid-template-columns` / `grid-template-rows`
- `gap`
- `grid-template-areas`

项目可通过 `grid-column`、`grid-row` 或 `grid-area` 指定占位。

### 追问延展

- Grid 适合整体页面骨架；局部对齐和一维排列常与 Flex 搭配

## 14. 回流与重绘

### 题目

什么是回流（reflow）和重绘（repaint）？如何减少？

### 作答

- 回流：布局几何信息变化后，浏览器重新计算布局
- 重绘：元素外观变化但布局不变，浏览器重新绘制像素

优化方向：

- 批量修改样式，减少频繁读写交错
- 动画优先使用 `transform`、`opacity`
- 减少复杂 DOM 结构和无意义样式计算

### 追问延展

- 回流成本通常高于重绘，排查卡顿时优先关注布局抖动

## 15. CSS 选择器优先级

### 题目

CSS 选择器优先级如何计算？

### 作答

可按权重理解：

- 行内样式最高
- `id` 选择器高于类/属性/伪类
- 类/属性/伪类高于标签/伪元素
- 同权重时后声明覆盖前声明

`!important` 会提升声明优先级，但应谨慎使用。

### 追问延展

- 现代项目更推荐通过合理命名和层级管理控制优先级，而不是堆叠选择器长度

## 16. CSS 面试答题通用框架

遇到 CSS 题，回答顺序可稳定为：

1. 定义：先说清概念和关键属性
2. 行为：解释渲染或布局行为
3. 场景：给一个常见业务落地场景
4. 边界：补一个兼容性或实现条件
