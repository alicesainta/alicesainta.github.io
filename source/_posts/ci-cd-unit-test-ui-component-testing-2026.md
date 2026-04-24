---
title: CI/CD、单元测试与 UI 组件测试实战
date: 2026-03-10 20:20:00
categories: 学习记录
tags:
  - CI/CD
  - 单元测试
  - UI测试
  - React
  - 工程化
cover: /images/covers/cover-11.jpg
comments: false
---

> 这篇文章不讲空话，只回答三个问题：为什么要做 CI/CD、为什么要写单元测试、UI 组件到底该怎么测。

## 一、CI/CD 的意义不是“自动化本身”

很多团队把 CI/CD 理解成“把命令放进流水线”。这只是表面。  
CI/CD 的核心价值是把质量门槛前移，让问题在合并前暴露，而不是线上事故后补救。

可以直接落地的目标：

- 每个 PR 都必须通过同一套校验（格式、Lint、测试、构建）。
- 失败即阻断合并，避免“带病代码”进入主分支。
- 发布流程标准化，减少“只有某个人会发版”的单点风险。

## 二、单元测试为什么值得投入

单元测试不是为了追求覆盖率数字，而是为了降低改动风险。

你能直接感知到的收益：

- 重构更安全：改内部实现时，只要行为不变，测试仍应通过。
- 回归更快：历史 bug 可以沉淀为测试用例，避免反复踩坑。
- 协作成本更低：别人改你的模块时，可以通过测试快速知道是否破坏行为。

不建议的做法：

- 只追求行覆盖率，不关心关键路径是否被验证。
- 只测“正常路径”，不测边界、错误态、空态、加载态。

## 三、如何测试 UI 组件（以 React 为例）

测试 UI 组件时，优先测试“用户能看到和能操作的行为”，而不是组件内部实现细节。

推荐工具组合：

- `@testing-library/react`：从用户视角查询和交互。
- `@testing-library/jest-dom`：可读性更好的断言。
- `vitest` 或 `jest`：测试运行器。

### 1. 先定义组件的可观察行为

以一个 `Button` 组件为例，最小行为应包含：

- 默认文案是否正确渲染。
- 点击是否触发回调。
- `disabled` 时是否不可点击。
- `loading` 时是否展示加载态并禁用重复触发。

### 2. 示例：行为导向测试

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

it("点击按钮会触发 onClick", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>提交</Button>);
  await user.click(screen.getByRole("button", { name: "提交" }));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

it("disabled 状态下不会触发 onClick", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(
    <Button disabled onClick={handleClick}>
      提交
    </Button>,
  );
  await user.click(screen.getByRole("button", { name: "提交" }));

  expect(handleClick).not.toHaveBeenCalled();
});
```

## 四、UI 组件测试清单（可直接复用）

每个核心组件至少覆盖下面这些点：

- 渲染：默认文案、默认样式、默认状态。
- 交互：点击、输入、聚焦、键盘操作。
- 状态：禁用、加载、错误、空数据。
- 可访问性：语义化标签、`aria-*`、键盘可达性。
- 异步：请求成功、请求失败、重试流程。

## 五、测试分层建议（避免“全靠 E2E”）

推荐分层：

- 单元测试：组件和函数的核心行为。
- 集成测试：页面内多个模块联动是否正确。
- E2E 测试：关键业务路径（如下单、支付、登录）。

经验原则：

- 越靠底层，执行越快、定位越准。
- 越靠上层，覆盖越真实、但成本更高。

## 六、CI 里怎么接入测试

一个务实的流水线顺序如下：

1. 安装依赖（锁版本）。
2. 代码格式检查（或格式化校验）。
3. Lint。
4. 单元测试。
5. 构建。

只要任一步失败，流水线立刻失败并阻断合并。

## 七、总结

优先做这两步：

- 为核心 UI 组件补齐行为测试。
- 在 CI 中把测试设置为强制门禁。
